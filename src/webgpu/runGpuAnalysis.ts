const N_HANDS = 2598960; // 52C5: number of possible poker hands
const N_HOLDS = 32; // 2^5: number of possible hold combinations
const WORKGROUP_SIZE = 40; // This needs to be both a factor of N_HANDS and smaller than 256
const N_WORKGROUPS = N_HANDS / WORKGROUP_SIZE; // This needs to be a factor of N_HANDS and smaller than 65536

export const runGpuAnalysis = async (
  handIndex: number,
  paytableArray: number[]
) => {
  if (!navigator?.gpu) throw Error("WebGPU not supported.");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw Error("Couldn’t request WebGPU adapter.");

  const device = await adapter.requestDevice();
  if (!device) throw Error("Couldn’t request WebGPU logical device.");

  const paytable = Uint32Array.from(paytableArray);

  // Get paytable ready for GPU
  const paytableGPUBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: paytable.byteLength,
    usage: GPUBufferUsage.STORAGE,
  });
  const paytableArrayBuffer = paytableGPUBuffer.getMappedRange();
  new Uint32Array(paytableArrayBuffer).set(paytable);
  paytableGPUBuffer.unmap();

  // Send hand index to GPU
  const inputHand = [handIndex];
  const inputHandGPUBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: 4, // u32
    usage: GPUBufferUsage.UNIFORM,
  });
  const inputHandArrayBuffer = inputHandGPUBuffer.getMappedRange();
  new Uint32Array(inputHandArrayBuffer).set(inputHand);
  inputHandGPUBuffer.unmap();

  // Create GPU buffer for total-payout table result
  const size = N_HOLDS * 4;
  const resultBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  // Create GPU buffer for n-holds result
  const holdsBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  // Create GPU buffer for n-wins result
  const nWinsBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  // Create GPU buffer for max-payout result
  const maxPayBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const module = device.createShaderModule({
    code: `
    const deckSize = 52u;
    const handSize = 5u;
    
    @group(0) @binding(0)
    var<storage, read> lookupPayTable: array<u32, ${N_HANDS}>;
    
    @group(0) @binding(1)
    var<uniform> inputHandIdx: u32;
    
    @group(0) @binding(2)
    var<storage, read_write> output: array<atomic<u32>>; 
    
    @group(0) @binding(3)
    var<storage, read_write> holds: array<atomic<u32>>; 
        
    @group(0) @binding(4)
    var<storage, read_write> nWins: array<atomic<u32>>; 
        
    @group(0) @binding(5)
    var<storage, read_write> maxPayout: array<atomic<u32>>; 
    
    fn productRange (a: u32, b: u32) -> u32 {
      var product: u32 = a;
      var i: u32 = a;
      while (i + 1 < b) {
        i++;
        product *= i;
      }
      return product;
    };
    
    fn choose (n: u32, rIn: u32) -> u32 {
      // This is supposed to be a pretty speedy nCr calculator
      var r = rIn;
      if (r > n) {
        return 0;
      }
      if (n == r || r == 0) {
        return 1;
      } else {
        r = select(n - r, r, r < n - r);
        return productRange(r + 1, n) / productRange(1, n - r);
      }
    };
    
    fn ithCombination (index: u32, nIn: u32, K: u32) -> array<u32, 5> {
      // This is optimized for speed by integrating the nCr in-line
      // which makes it a bit uglier!
      var n = nIn;
      var nCk = 1u;
      var j = 0u;
      for (var i = n; i > n - K; i--) {
        nCk *= i;
        nCk = nCk / (j + 1); // Floor division because u32's
        j++;
      }
      var curIndex = nCk;
      var result: array<u32, 5>;
      var l = 0;
      for (var k = K; k > 0u; k--) {
        nCk *= k;
        nCk = nCk / n; // Floor division because u32's
        while (curIndex - nCk > index) {
          curIndex -= nCk;
          nCk *= n - k;
          nCk -= nCk % k;
          n--;
          nCk = nCk / n; // Floor division because u32's
        }
        n--;
        result[l] = n;
        l++;
      }
      return result;
    }
    
    @compute @workgroup_size(${WORKGROUP_SIZE})
    fn main(  
      @builtin(global_invocation_id)
      global_id : vec3<u32>,
      @builtin(local_invocation_id)
      local_id : vec3<u32>
  ) {
      // Worker is responsible for ith nCr hand. 
      if (global_id.x >= ${N_HANDS}) {
        return;
     }
      
      // 1. What hand should I evaluate? 
      var evaluationHandIdx = global_id.x; 
      
      // 2. What's the payout for this hand?
      var payout = lookupPayTable[evaluationHandIdx];
      // 3. What cards were held in the input hand?
      var inputHand = ithCombination(inputHandIdx, deckSize, handSize);
      var evaluationHand = ithCombination(evaluationHandIdx, deckSize, handSize);
      var holdMask = 0u;
      for (var i = 0u; i < handSize; i++) {
        for (var j = 0u; j < handSize; j++) {
          if (inputHand[i] == evaluationHand[j]) {
            holdMask = holdMask | (1u << (handSize - i - 1));
          }
        }
      }
      
      // Add stats to the holds table output
      let atomic_output_ptr: ptr<storage, atomic<u32>, read_write> = &output[holdMask];
      let atomic_holds_ptr: ptr<storage, atomic<u32>, read_write> = &holds[holdMask];
      let atomic_nWins_ptr: ptr<storage, atomic<u32>, read_write> = &nWins[holdMask];
      let atomic_maxPayout_ptr: ptr<storage, atomic<u32>, read_write> = &maxPayout[holdMask];
      
      atomicAdd(atomic_output_ptr, payout);
      atomicAdd(atomic_holds_ptr, 1u);
      if (payout > 0u) {
        atomicAdd(atomic_nWins_ptr, 1u);
      }
      atomicMax(atomic_maxPayout_ptr, payout);
    }
  `,
  });

  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module, entryPoint: "main" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: paytableGPUBuffer } },
      { binding: 1, resource: { buffer: inputHandGPUBuffer } },
      { binding: 2, resource: { buffer: resultBuffer } },
      { binding: 3, resource: { buffer: holdsBuffer } },
      { binding: 4, resource: { buffer: nWinsBuffer } },
      { binding: 5, resource: { buffer: maxPayBuffer } },
    ],
  });

  // Calculation time!!
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(N_WORKGROUPS);
  passEncoder.end();

  const resultReadBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const holdsReadBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const nWinsReadBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const maxPayReadBuffer = device.createBuffer({
    size: size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(resultBuffer, 0, resultReadBuffer, 0, size);
  commandEncoder.copyBufferToBuffer(holdsBuffer, 0, holdsReadBuffer, 0, size);
  commandEncoder.copyBufferToBuffer(nWinsBuffer, 0, nWinsReadBuffer, 0, size);
  commandEncoder.copyBufferToBuffer(maxPayBuffer, 0, maxPayReadBuffer, 0, size);

  // Probably want to do this a second time for the holds buffer
  const commands = commandEncoder.finish();
  device.queue.submit([commands]);

  await resultReadBuffer.mapAsync(GPUMapMode.READ);
  const copyResultArrayBuffer = resultReadBuffer.getMappedRange();

  await holdsReadBuffer.mapAsync(GPUMapMode.READ);
  const copyHoldsArrayBuffer = holdsReadBuffer.getMappedRange();

  await nWinsReadBuffer.mapAsync(GPUMapMode.READ);
  const copyNWinsArrayBuffer = nWinsReadBuffer.getMappedRange();

  await maxPayReadBuffer.mapAsync(GPUMapMode.READ);
  const copyMaxPayArrayBuffer = maxPayReadBuffer.getMappedRange();

  return {
    holdIds: new Array(N_HOLDS).fill(0).map((_, i) => i),
    totalSwaps: new Uint32Array(copyHoldsArrayBuffer),
    totalPayout: new Uint32Array(copyResultArrayBuffer),
    totalWins: new Uint32Array(copyNWinsArrayBuffer),
    maxPayout: new Uint32Array(copyMaxPayArrayBuffer),
  };
};
