# Video Poker Simulator

This simulator not only allows you to play your favorite video poker variants, but also provides detailed analysis for each hand to learn optimal play. It features an auto-play mode to observe trends and statistics over thousands of hands, enhancing your gaming and learning experience.

![Video poker](https://github.com/mfantham/video-poker-simulator/blob/main/readme/screenshot.webp)

## Getting Started

### Prerequisites

Like most JavaScript/TypeScript projects, you'll need [Node.js](https://nodejs.org/en/download) installed.
For package management, yarn is recommended for its efficiency and better management capabilities: `npm i -g yarn`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mfantham/video-poker-simulator.git
   ```
2. **Install Dependencies**:
   ```bash
   yarn install
   ```
3. **Starting the App**:
   ```bash
   yarn start
   ```

## Future Enhancements

- **Testing Coming Soon**: Integration of Jest and react-testing-library for robust testing, along with Codecov for code coverage analysis. See my [other projects](https://github.com/mfantham/gamma-gradient) for an example.

## Technologies

This project is built using React and TypeScript, utilizing create-react-app as a foundation.

This project uses [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) for parallel computation of hands, which is a cornerstone of the application's performance capabilities. This is new, experimental web technology, and is unfortunately not supported on mobile _yet_. However it works natively with Windows/Mac Chrome 113+. Check if your favorite desktop browser requires a flag: [caniuse webgpu?](https://caniuse.com/?search=webgpu)

## WebGPU code

See this project's [WebGPU code here](https://github.com/mfantham/video-poker-simulator/blob/main/src/webgpu/runGpuAnalysis.ts)

## License

This project is open-sourced under the MIT License.
