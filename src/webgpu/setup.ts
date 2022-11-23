import { HoldsTable } from "../types/Hold";

export const runGpuAnalysis = async (): Promise<HoldsTable> => {
  if (!navigator?.gpu) throw Error("WebGPU not supported.");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw Error("Couldn’t request WebGPU adapter.");

  const device = await adapter.requestDevice();
  if (!device) throw Error("Couldn’t request WebGPU logical device.");

  const module = device.createShaderModule({
    code: `
    struct Card {
      suit: u32,
      value: u32,
    }
    const nCards = 5;
    var<private> hand: array<Card, nCards>;
    
    @group(0) @binding(1)
    var<storage, read_write> output: array<i32>;
    
    // ROYAL_FLUSH, STRAIGHT_FLUSH, FOUR_OF_A_KIND, FULL_HOUSE, FLUSH, STRAIGHT, THREE_OF_A_KIND, TWO_PAIR, JACKS_OR_BETTER, DEFAULT
    // 0,           1,              2,              3,          4,     5,        6,               7,        8,               9
    const payTable = array(800, 50, 25, 9, 6, 4, 3, 2, 1, 0);
    
    fn isFlush(f_hand: array<Card, nCards>) -> bool {
      var suit: u32 = f_hand[0].suit;
      for ( var i: i32 = 1; i < nCards; i++ ) {
        if ( suit != f_hand[i].suit ) {
          return false;
        }
      }
      return true;
    }
    
    @compute @workgroup_size(240)
    fn main(  
      @builtin(global_invocation_id)
      global_id : vec3<u32>,
      @builtin(local_invocation_id)
      local_id : vec3<u32>
  ) {
      // One worker is responsible for one hand, taken from the input array
      // Hand format: binary encoding. i32. 
      // 000000 000000 000000 000000 000000
      // 0->d12: clubs; d13-d25: diamonds; d26-38: hearts; d39-51
      // So, card%13 = value; card/4 = suit;
  
      // 47C1 = 47;  // 5 of these, 48, 95, 142, 189, 236
      // 47C2 = 1081; // 10 of these, 
      // 47C3 = 16215; // 10 of these,
      // 47C4 = 178365; // 5 of these,
      // 47C5 = 1533939; // 1 of these
      
      // Make hand
      const hand = array(3, 6, 12, 43, 44);
      const discards = global_id.x < 48 ? 1 : // 00001 
                       global_id.x < 95 ? 2 : // 00010 
                       global_id.x < 142 ? 4 : // 00100
                       global_id.x < 189 ? 8 : // 01000
                       global_id.x < 236 ? 16 : // 10000 
                       global_id.x < 1317 ? 3 : // 00011
                       global_id.x < 2398 ? 5 : // 00101
                       global_id.x < 3479 ? 6 : // 00110
                       global_id.x < 4560 ? 9 : // 01001
                       global_id.x < 5641 ? 10 : // 01010
                       global_id.x < 6722 ? 12 : // 01100
                       global_id.x < 7803 ? 17 : // 10001
                       global_id.x < 8884 ? 18 : // 10010
                       global_id.x < 9965 ? 20 : // 10100
                       global_id.x < 11046 ? 24 : // 11000
                       global_id.x < 27261 ? 7 : // 00111
                       global_id.x < 43476 ? 11 : // 01011
                       global_id.x < 59691 ? 13 : // 01101
                       global_id.x < 75906 ? 14 : // 01110
                       global_id.x < 92121 ? 19 : // 10011
                       global_id.x < 108336 ? 21 : // 10101
                       global_id.x < 124551 ? 22 : // 10110
                       global_id.x < 140766 ? 25 : // 11001
                       global_id.x < 156981 ? 26 : // 11010
                       global_id.x < 173196 ? 28 : // 11100
                       global_id.x < 351561 ? 15 : // 01111
                       global_id.x < 529926 ? 23 : // 10111
                       global_id.x < 708291 ? 27 : // 11011
                       global_id.x < 886656 ? 29 : // 11101
                       global_id.x < 1065021 ? 30 : // 11110
                       31; // Discard all 11111
                       
      
      
      // Calculate payout
      var payout = 0;
      if (isFlush(hand)) {
        payout = payTable[4];
      }
      
      output[global_id.x] = payout; //f32(global_id.x) * 1000. + f32(local_id.x);
    }
  `,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage" as GPUBufferBindingType,
        },
      },
    ],
  });

  const BUFFER_SIZE = 1000;
  const output = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const stagingBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 1,
        resource: {
          buffer: output,
        },
      },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module,
      entryPoint: "main",
    },
  });

  // Calculation time!!
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(65535);
  passEncoder.end();
  commandEncoder.copyBufferToBuffer(
    output,
    0, // Source offset
    stagingBuffer,
    0, // Destination offset
    BUFFER_SIZE
  );
  const commands = commandEncoder.finish();
  device.queue.submit([commands]);

  await stagingBuffer.mapAsync(
    GPUMapMode.READ,
    0, // Offset
    BUFFER_SIZE // Length
  );
  const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE);
  const data = copyArrayBuffer.slice(0);
  stagingBuffer.unmap();
  console.log(new Int32Array(data));

  return [];
};
