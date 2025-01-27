export default function Landing() {
  return (
    <div className="bg-[#f7fbff] text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header Section */}
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-[#0b8eca] mb-4">
          مرحباً بكم في
        </h1>
      </div>
      <div className="w-full max-w-[600px] min-w-[100px] mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          zoomAndPan="magnify"
          viewBox="0 0 375 374.999991"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          version="1.0"
        >
          <defs>
            <g />
            <clipPath id="061eff112a">
              <path
                d="M 30 231 L 70 231 L 70 298.496094 L 30 298.496094 Z M 30 231 "
                clipRule="nonzero"
              />
            </clipPath>
            <clipPath id="d5f5585175">
              <path
                d="M 47 76.496094 L 336 76.496094 L 336 199 L 47 199 Z M 47 76.496094 "
                clipRule="nonzero"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#061eff112a)">
            <path
              fill="#0b8eca"
              d="M 58.878906 231.894531 C 53.910156 236.039062 46.191406 236.4375 40.707031 232.101562 C 40.707031 235.320312 34.867188 243.875 31.671875 276.042969 C 30.953125 283.742188 30.648438 291.441406 30.132812 299.039062 L 69.351562 299.039062 C 66.839844 244.804688 58.878906 237.101562 58.878906 231.894531 Z M 58.878906 231.894531 "
              fillOpacity="1"
              fillRule="nonzero"
            />
          </g>
          <path
            fill="#0b8eca"
            d="M 280.898438 173.644531 C 253.144531 181.558594 225.394531 189.480469 197.640625 197.390625 C 196.449219 197.730469 195.191406 197.722656 194.007812 197.355469 C 167.472656 189.207031 138.890625 180.355469 117.628906 173.730469 C 113.515625 172.449219 109.347656 175.523438 109.347656 179.828125 L 109.347656 226.410156 C 109.347656 229.714844 111.890625 232.429688 115.183594 232.734375 C 144.492188 235.441406 171.945312 242.164062 195.34375 260.179688 C 197.667969 261.96875 200.835938 261.96875 203.160156 260.179688 C 226.773438 242.007812 254.273438 235.425781 283.214844 232.722656 C 286.507812 232.414062 289.039062 229.699219 289.039062 226.394531 L 289.039062 179.789062 C 289.039062 175.546875 284.980469 172.480469 280.898438 173.644531 Z M 280.898438 173.644531 "
            fillOpacity="1"
            fillRule="nonzero"
          />
          <g clipPath="url(#d5f5585175)">
            <path
              fill="#0b8eca"
              d="M 331.269531 126.699219 C 287.144531 110.222656 243.023438 93.742188 198.898438 77.265625 C 197.578125 76.773438 196.089844 76.789062 194.773438 77.296875 C 112.148438 109.019531 54.324219 131.921875 51.179688 132.980469 C 48.109375 134.011719 47.183594 135.984375 47.277344 138.933594 C 47.484375 158.851562 47.484375 178.667969 47.6875 198.480469 C 48.542969 198.195312 50.738281 198.195312 51.589844 198.480469 L 51.589844 144.117188 C 51.589844 140.21875 55.367188 137.4375 59.089844 138.597656 C 104.421875 152.6875 149.753906 166.78125 195.085938 180.875 C 196.230469 181.230469 197.457031 181.222656 198.597656 180.847656 C 242.746094 166.4375 286.890625 152.023438 331.039062 137.613281 C 336.238281 135.914062 336.390625 128.613281 331.269531 126.699219 Z M 331.269531 126.699219 "
              fillOpacity="1"
              fillRule="nonzero"
            />
          </g>
          <path
            fill="#0b8eca"
            d="M 34.957031 213.265625 C 34.957031 225.570312 49.503906 232.476562 58.878906 224.660156 C 69.8125 216.050781 63.441406 198.480469 49.640625 198.480469 C 41.871094 198.480469 34.957031 204.855469 34.957031 213.265625 Z M 34.957031 213.265625 "
            fillOpacity="1"
            fillRule="nonzero"
          />
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(152.227585, 137.665295)">
              <g>
                <path d="M 13.921875 8.03125 C 11.648438 8.03125 9.554688 7.6875 7.640625 7 C 5.734375 6.320312 4.195312 5.234375 3.03125 3.734375 C 1.863281 2.242188 1.28125 0.300781 1.28125 -2.09375 C 1.28125 -2.75 1.40625 -3.796875 1.65625 -5.234375 C 1.914062 -6.671875 2.601562 -8.398438 3.71875 -10.421875 L 6.828125 -8.96875 C 6.179688 -7.632812 5.707031 -6.484375 5.40625 -5.515625 C 5.101562 -4.546875 4.953125 -3.617188 4.953125 -2.734375 C 4.953125 -0.941406 5.398438 0.472656 6.296875 1.515625 C 7.191406 2.554688 8.382812 3.300781 9.875 3.75 C 11.375 4.207031 13.035156 4.4375 14.859375 4.4375 C 18.171875 4.4375 20.867188 3.851562 22.953125 2.6875 C 25.046875 1.519531 26.378906 0.0546875 26.953125 -1.703125 C 27.128906 -2.273438 27.285156 -2.875 27.421875 -3.5 C 26.878906 -3.332031 26.304688 -3.210938 25.703125 -3.140625 C 25.109375 -3.066406 24.515625 -3.03125 23.921875 -3.03125 C 21.753906 -3.03125 20.078125 -3.476562 18.890625 -4.375 C 17.710938 -5.269531 17.125 -6.628906 17.125 -8.453125 C 17.125 -9.535156 17.296875 -10.625 17.640625 -11.71875 C 17.984375 -12.820312 18.46875 -13.828125 19.09375 -14.734375 C 19.71875 -15.648438 20.472656 -16.382812 21.359375 -16.9375 C 22.242188 -17.488281 23.226562 -17.765625 24.3125 -17.765625 C 25.820312 -17.765625 27.085938 -17.265625 28.109375 -16.265625 C 29.128906 -15.273438 29.890625 -13.972656 30.390625 -12.359375 C 30.890625 -10.753906 31.140625 -9.054688 31.140625 -7.265625 C 31.140625 -5.835938 31.019531 -4.441406 30.78125 -3.078125 C 30.539062 -1.710938 30.117188 -0.445312 29.515625 0.71875 C 28.578125 2.519531 27.335938 3.953125 25.796875 5.015625 C 24.265625 6.085938 22.484375 6.859375 20.453125 7.328125 C 18.429688 7.796875 16.253906 8.03125 13.921875 8.03125 Z M 20.5 -9.3125 C 20.5 -8.40625 20.785156 -7.691406 21.359375 -7.171875 C 21.929688 -6.660156 22.914062 -6.40625 24.3125 -6.40625 C 25.53125 -6.40625 26.695312 -6.578125 27.8125 -6.921875 C 27.8125 -7.117188 27.8125 -7.316406 27.8125 -7.515625 C 27.8125 -8.710938 27.65625 -9.820312 27.34375 -10.84375 C 27.03125 -11.875 26.585938 -12.703125 26.015625 -13.328125 C 25.441406 -13.953125 24.757812 -14.265625 23.96875 -14.265625 C 23.3125 -14.265625 22.71875 -14.007812 22.1875 -13.5 C 21.664062 -12.988281 21.253906 -12.351562 20.953125 -11.59375 C 20.648438 -10.84375 20.5 -10.082031 20.5 -9.3125 Z M 26.484375 -22.171875 C 25.890625 -22.171875 25.382812 -22.378906 24.96875 -22.796875 C 24.5625 -23.210938 24.359375 -23.703125 24.359375 -24.265625 C 24.359375 -24.835938 24.5625 -25.335938 24.96875 -25.765625 C 25.382812 -26.191406 25.890625 -26.40625 26.484375 -26.40625 C 27.054688 -26.40625 27.546875 -26.191406 27.953125 -25.765625 C 28.367188 -25.335938 28.578125 -24.835938 28.578125 -24.265625 C 28.578125 -23.703125 28.367188 -23.210938 27.953125 -22.796875 C 27.546875 -22.378906 27.054688 -22.171875 26.484375 -22.171875 Z M 20.640625 -22.171875 C 20.035156 -22.171875 19.523438 -22.378906 19.109375 -22.796875 C 18.703125 -23.210938 18.5 -23.703125 18.5 -24.265625 C 18.5 -24.835938 18.703125 -25.335938 19.109375 -25.765625 C 19.523438 -26.191406 20.035156 -26.40625 20.640625 -26.40625 C 21.203125 -26.40625 21.691406 -26.191406 22.109375 -25.765625 C 22.523438 -25.335938 22.734375 -24.835938 22.734375 -24.265625 C 22.734375 -23.703125 22.523438 -23.210938 22.109375 -22.796875 C 21.691406 -22.378906 21.203125 -22.171875 20.640625 -22.171875 Z M 20.640625 -22.171875 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(187.847817, 143.089975)">
              <g>
                <path d="M 3.984375 -25.25 C 2.835938 -25.25 2.078125 -25.625 1.703125 -26.375 C 1.335938 -27.132812 1.15625 -27.941406 1.15625 -28.796875 C 1.15625 -29.109375 1.175781 -29.441406 1.21875 -29.796875 C 1.257812 -30.148438 1.320312 -30.554688 1.40625 -31.015625 L 3.546875 -31.609375 C 3.378906 -30.640625 3.296875 -29.828125 3.296875 -29.171875 C 3.296875 -28.117188 3.648438 -27.59375 4.359375 -27.59375 C 4.785156 -27.59375 5.140625 -27.8125 5.421875 -28.25 C 5.710938 -28.695312 5.875 -29.585938 5.90625 -30.921875 L 5.90625 -32.203125 L 7.953125 -32.984375 L 7.953125 -30.375 C 7.953125 -29.976562 8.03125 -29.628906 8.1875 -29.328125 C 8.34375 -29.023438 8.675781 -28.875 9.1875 -28.875 C 9.695312 -28.875 10.035156 -29.03125 10.203125 -29.34375 C 10.378906 -29.65625 10.46875 -30.054688 10.46875 -30.546875 C 10.46875 -31.023438 10.410156 -31.515625 10.296875 -32.015625 C 10.179688 -32.515625 10.023438 -33.003906 9.828125 -33.484375 L 11.75 -34.09375 C 12.03125 -33.519531 12.265625 -32.890625 12.453125 -32.203125 C 12.640625 -31.523438 12.734375 -30.898438 12.734375 -30.328125 C 12.734375 -29.390625 12.46875 -28.539062 11.9375 -27.78125 C 11.414062 -27.03125 10.597656 -26.65625 9.484375 -26.65625 C 8.578125 -26.65625 7.835938 -26.910156 7.265625 -27.421875 C 7.003906 -26.765625 6.582031 -26.238281 6 -25.84375 C 5.414062 -25.445312 4.742188 -25.25 3.984375 -25.25 Z M 1.5 -34.09375 L 1.109375 -36.140625 C 2.304688 -36.234375 3.359375 -36.382812 4.265625 -36.59375 C 5.179688 -36.8125 5.96875 -37.0625 6.625 -37.34375 C 5.914062 -37.71875 5.335938 -38.195312 4.890625 -38.78125 C 4.453125 -39.363281 4.234375 -40.066406 4.234375 -40.890625 C 4.234375 -41.890625 4.582031 -42.757812 5.28125 -43.5 C 5.976562 -44.238281 6.894531 -44.609375 8.03125 -44.609375 C 9.175781 -44.609375 10.039062 -44.207031 10.625 -43.40625 C 11.207031 -42.613281 11.5 -41.734375 11.5 -40.765625 C 11.5 -38.859375 10.585938 -37.304688 8.765625 -36.109375 C 6.941406 -34.910156 4.519531 -34.238281 1.5 -34.09375 Z M 6.453125 -40.890625 C 6.453125 -40.429688 6.628906 -39.976562 6.984375 -39.53125 C 7.347656 -39.09375 7.800781 -38.765625 8.34375 -38.546875 C 8.988281 -39.171875 9.3125 -39.863281 9.3125 -40.625 C 9.3125 -41.144531 9.195312 -41.570312 8.96875 -41.90625 C 8.75 -42.25 8.410156 -42.421875 7.953125 -42.421875 C 7.523438 -42.421875 7.164062 -42.269531 6.875 -41.96875 C 6.59375 -41.675781 6.453125 -41.316406 6.453125 -40.890625 Z M 6.453125 -40.890625 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(185.284979, 137.665295)">
              <g>
                <path d="M 2.484375 9.828125 L 1.703125 6.328125 C 3.472656 6.097656 5.085938 5.757812 6.546875 5.3125 C 8.015625 4.875 9.273438 4.253906 10.328125 3.453125 C 11.390625 2.660156 12.175781 1.582031 12.6875 0.21875 L 9.953125 0.21875 C 8.671875 0.21875 7.476562 0.0390625 6.375 -0.3125 C 5.28125 -0.675781 4.398438 -1.253906 3.734375 -2.046875 C 3.066406 -2.847656 2.734375 -3.890625 2.734375 -5.171875 C 2.734375 -6.734375 3.046875 -8.21875 3.671875 -9.625 C 4.296875 -11.039062 5.148438 -12.1875 6.234375 -13.0625 C 7.316406 -13.945312 8.539062 -14.390625 9.90625 -14.390625 C 11.875 -14.390625 13.503906 -13.53125 14.796875 -11.8125 C 16.097656 -10.09375 16.75 -7.453125 16.75 -3.890625 C 16.75 -3.691406 16.75 -3.492188 16.75 -3.296875 L 20.59375 -3.296875 C 21.1875 -3.296875 21.617188 -3.128906 21.890625 -2.796875 C 22.160156 -2.472656 22.296875 -2.082031 22.296875 -1.625 C 22.296875 -1.164062 22.097656 -0.742188 21.703125 -0.359375 C 21.304688 0.0234375 20.789062 0.21875 20.15625 0.21875 L 16.234375 0.21875 C 14.773438 5.738281 10.191406 8.941406 2.484375 9.828125 Z M 11.578125 -3.296875 L 13.375 -3.296875 C 13.394531 -3.578125 13.40625 -3.859375 13.40625 -4.140625 C 13.40625 -6.078125 13.050781 -7.6875 12.34375 -8.96875 C 11.632812 -10.25 10.707031 -10.890625 9.5625 -10.890625 C 8.96875 -10.890625 8.40625 -10.660156 7.875 -10.203125 C 7.351562 -9.753906 6.9375 -9.144531 6.625 -8.375 C 6.3125 -7.601562 6.15625 -6.765625 6.15625 -5.859375 C 6.15625 -4.859375 6.601562 -4.179688 7.5 -3.828125 C 8.394531 -3.472656 9.753906 -3.296875 11.578125 -3.296875 Z M 11.578125 -3.296875 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(205.444006, 137.665295)">
              <g>
                <path d="M 0 0.21875 L 0.421875 -3.296875 C 1.390625 -3.296875 2.394531 -3.304688 3.4375 -3.328125 C 4.476562 -3.359375 5.484375 -3.429688 6.453125 -3.546875 C 5.765625 -4.171875 5.09375 -4.976562 4.4375 -5.96875 C 3.78125 -6.96875 3.453125 -8.179688 3.453125 -9.609375 C 3.453125 -11.117188 3.804688 -12.492188 4.515625 -13.734375 C 5.234375 -14.972656 6.15625 -15.945312 7.28125 -16.65625 C 8.40625 -17.375 9.625 -17.734375 10.9375 -17.734375 C 12.332031 -17.734375 13.554688 -17.347656 14.609375 -16.578125 C 15.660156 -15.804688 16.476562 -14.828125 17.0625 -13.640625 C 17.644531 -12.460938 17.9375 -11.234375 17.9375 -9.953125 C 17.9375 -8.617188 17.664062 -7.421875 17.125 -6.359375 C 16.582031 -5.304688 15.859375 -4.382812 14.953125 -3.59375 C 16.085938 -3.5 17.253906 -3.425781 18.453125 -3.375 C 19.648438 -3.320312 20.691406 -3.296875 21.578125 -3.296875 C 22.171875 -3.296875 22.601562 -3.128906 22.875 -2.796875 C 23.144531 -2.472656 23.28125 -2.082031 23.28125 -1.625 C 23.28125 -1.164062 23.078125 -0.742188 22.671875 -0.359375 C 22.273438 0.0234375 21.765625 0.21875 21.140625 0.21875 C 19.410156 0.21875 17.601562 0.0820312 15.71875 -0.1875 C 13.84375 -0.457031 12.191406 -0.796875 10.765625 -1.203125 C 10.304688 -1.023438 9.835938 -0.863281 9.359375 -0.71875 C 8.046875 -0.351562 6.546875 -0.109375 4.859375 0.015625 C 3.179688 0.148438 1.5625 0.21875 0 0.21875 Z M 6.96875 -9.53125 C 6.96875 -8.414062 7.304688 -7.4375 7.984375 -6.59375 C 8.671875 -5.757812 9.441406 -5.085938 10.296875 -4.578125 C 11.460938 -5.085938 12.441406 -5.769531 13.234375 -6.625 C 14.035156 -7.476562 14.4375 -8.503906 14.4375 -9.703125 C 14.4375 -10.347656 14.28125 -11.019531 13.96875 -11.71875 C 13.65625 -12.414062 13.226562 -13.003906 12.6875 -13.484375 C 12.144531 -13.972656 11.519531 -14.21875 10.8125 -14.21875 C 10.125 -14.21875 9.488281 -13.984375 8.90625 -13.515625 C 8.320312 -13.046875 7.851562 -12.453125 7.5 -11.734375 C 7.144531 -11.023438 6.96875 -10.289062 6.96875 -9.53125 Z M 10.5625 -22.125 C 9.957031 -22.125 9.445312 -22.332031 9.03125 -22.75 C 8.625 -23.164062 8.421875 -23.65625 8.421875 -24.21875 C 8.421875 -24.789062 8.625 -25.289062 9.03125 -25.71875 C 9.445312 -26.144531 9.957031 -26.359375 10.5625 -26.359375 C 11.125 -26.359375 11.613281 -26.144531 12.03125 -25.71875 C 12.445312 -25.289062 12.65625 -24.789062 12.65625 -24.21875 C 12.65625 -23.65625 12.445312 -23.164062 12.03125 -22.75 C 11.613281 -22.332031 11.125 -22.125 10.5625 -22.125 Z M 10.5625 -22.125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(226.585369, 137.665295)">
              <g>
                <path d="M 0 0.21875 L 0.421875 -3.296875 C 2.078125 -3.296875 3.378906 -3.359375 4.328125 -3.484375 C 5.285156 -3.609375 5.960938 -3.925781 6.359375 -4.4375 C 6.765625 -4.957031 6.96875 -5.800781 6.96875 -6.96875 C 6.96875 -8.019531 6.71875 -9.367188 6.21875 -11.015625 C 5.71875 -12.671875 5.15625 -14.3125 4.53125 -15.9375 L 7.984375 -17.21875 C 8.359375 -16.28125 8.707031 -15.234375 9.03125 -14.078125 C 9.363281 -12.921875 9.640625 -11.769531 9.859375 -10.625 C 10.085938 -9.488281 10.203125 -8.492188 10.203125 -7.640625 C 10.203125 -4.765625 9.40625 -2.734375 7.8125 -1.546875 C 6.21875 -0.367188 3.613281 0.21875 0 0.21875 Z M 9.3125 -21.65625 C 8.71875 -21.65625 8.210938 -21.863281 7.796875 -22.28125 C 7.390625 -22.695312 7.1875 -23.1875 7.1875 -23.75 C 7.1875 -24.320312 7.390625 -24.820312 7.796875 -25.25 C 8.210938 -25.675781 8.71875 -25.890625 9.3125 -25.890625 C 9.882812 -25.890625 10.375 -25.675781 10.78125 -25.25 C 11.195312 -24.820312 11.40625 -24.320312 11.40625 -23.75 C 11.40625 -23.1875 11.195312 -22.695312 10.78125 -22.28125 C 10.375 -21.863281 9.882812 -21.65625 9.3125 -21.65625 Z M 3.46875 -21.65625 C 2.863281 -21.65625 2.351562 -21.863281 1.9375 -22.28125 C 1.53125 -22.695312 1.328125 -23.1875 1.328125 -23.75 C 1.328125 -24.320312 1.53125 -24.820312 1.9375 -25.25 C 2.351562 -25.675781 2.863281 -25.890625 3.46875 -25.890625 C 4.03125 -25.890625 4.519531 -25.675781 4.9375 -25.25 C 5.351562 -24.820312 5.5625 -24.320312 5.5625 -23.75 C 5.5625 -23.1875 5.351562 -22.695312 4.9375 -22.28125 C 4.519531 -21.863281 4.03125 -21.65625 3.46875 -21.65625 Z M 3.46875 -21.65625 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(157.386338, 219.186914)">
              <g>
                <path d="M 0.484375 0.015625 C 0.484375 -0.367188 0.535156 -0.796875 0.640625 -1.265625 C 0.753906 -1.742188 0.925781 -2.269531 1.15625 -2.84375 L 2.328125 -2.390625 C 2.148438 -1.929688 2.019531 -1.515625 1.9375 -1.140625 C 1.851562 -0.765625 1.8125 -0.414062 1.8125 -0.09375 C 1.8125 0.507812 1.984375 0.992188 2.328125 1.359375 C 2.679688 1.734375 3.144531 2.003906 3.71875 2.171875 C 4.289062 2.347656 4.921875 2.4375 5.609375 2.4375 C 6.441406 2.4375 7.195312 2.34375 7.875 2.15625 C 8.5625 1.96875 9.109375 1.710938 9.515625 1.390625 C 9.921875 1.066406 10.125 0.710938 10.125 0.328125 C 10.125 0.046875 9.910156 -0.191406 9.484375 -0.390625 C 9.054688 -0.597656 8.453125 -0.8125 7.671875 -1.03125 L 7.984375 -2.375 C 9.085938 -1.925781 9.953125 -1.625 10.578125 -1.46875 C 11.210938 -1.3125 11.695312 -1.234375 12.03125 -1.234375 C 12.257812 -1.234375 12.421875 -1.171875 12.515625 -1.046875 C 12.617188 -0.929688 12.671875 -0.785156 12.671875 -0.609375 C 12.671875 -0.441406 12.59375 -0.285156 12.4375 -0.140625 C 12.289062 0.00390625 12.101562 0.078125 11.875 0.078125 L 11.265625 0.078125 C 11.273438 0.171875 11.285156 0.25 11.296875 0.3125 C 11.316406 0.375 11.328125 0.453125 11.328125 0.546875 C 11.328125 1.078125 11.085938 1.585938 10.609375 2.078125 C 10.128906 2.566406 9.429688 2.960938 8.515625 3.265625 C 7.609375 3.578125 6.519531 3.734375 5.25 3.734375 C 4.394531 3.734375 3.609375 3.597656 2.890625 3.328125 C 2.171875 3.066406 1.585938 2.660156 1.140625 2.109375 C 0.703125 1.554688 0.484375 0.859375 0.484375 0.015625 Z M 6.421875 6.78125 C 6.191406 6.78125 6 6.703125 5.84375 6.546875 C 5.6875 6.390625 5.609375 6.203125 5.609375 5.984375 C 5.609375 5.773438 5.6875 5.585938 5.84375 5.421875 C 6 5.265625 6.191406 5.1875 6.421875 5.1875 C 6.628906 5.1875 6.8125 5.265625 6.96875 5.421875 C 7.125 5.585938 7.203125 5.773438 7.203125 5.984375 C 7.203125 6.203125 7.125 6.390625 6.96875 6.546875 C 6.8125 6.703125 6.628906 6.78125 6.421875 6.78125 Z M 4.203125 6.78125 C 3.984375 6.78125 3.796875 6.703125 3.640625 6.546875 C 3.484375 6.390625 3.40625 6.203125 3.40625 5.984375 C 3.40625 5.773438 3.484375 5.585938 3.640625 5.421875 C 3.796875 5.265625 3.984375 5.1875 4.203125 5.1875 C 4.421875 5.1875 4.609375 5.265625 4.765625 5.421875 C 4.921875 5.585938 5 5.773438 5 5.984375 C 5 6.203125 4.921875 6.390625 4.765625 6.546875 C 4.609375 6.703125 4.421875 6.78125 4.203125 6.78125 Z M 4.203125 6.78125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(169.245712, 219.186914)">
              <g>
                <path d="M 0 0.078125 L 0.15625 -1.234375 C 0.675781 -1.234375 1.09375 -1.265625 1.40625 -1.328125 C 1.726562 -1.398438 1.957031 -1.535156 2.09375 -1.734375 C 2.238281 -1.929688 2.3125 -2.226562 2.3125 -2.625 C 2.3125 -3.019531 2.210938 -3.53125 2.015625 -4.15625 C 1.828125 -4.78125 1.617188 -5.398438 1.390625 -6.015625 L 2.6875 -6.5 C 2.832031 -6.144531 2.960938 -5.75 3.078125 -5.3125 C 3.203125 -4.875 3.304688 -4.441406 3.390625 -4.015625 C 3.484375 -3.585938 3.53125 -3.210938 3.53125 -2.890625 C 3.53125 -1.796875 3.242188 -1.023438 2.671875 -0.578125 C 2.097656 -0.140625 1.207031 0.078125 0 0.078125 Z M 1.71875 3.078125 C 1.5 3.078125 1.3125 3 1.15625 2.84375 C 1 2.6875 0.921875 2.5 0.921875 2.28125 C 0.921875 2.070312 1 1.882812 1.15625 1.71875 C 1.3125 1.5625 1.5 1.484375 1.71875 1.484375 C 1.9375 1.484375 2.125 1.5625 2.28125 1.71875 C 2.4375 1.882812 2.515625 2.070312 2.515625 2.28125 C 2.515625 2.5 2.4375 2.6875 2.28125 2.84375 C 2.125 3 1.9375 3.078125 1.71875 3.078125 Z M 1.71875 3.078125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(173.580184, 219.186914)">
              <g>
                <path d="M 2.296875 0.078125 C 2.003906 0.078125 1.707031 0.0507812 1.40625 0 C 1.113281 -0.0390625 0.910156 -0.0703125 0.796875 -0.09375 L 0.96875 -1.375 C 1.9375 -1.238281 2.820312 -1.25 3.625 -1.40625 C 4.425781 -1.5625 5.0625 -1.953125 5.53125 -2.578125 C 5.113281 -3.265625 4.484375 -4.097656 3.640625 -5.078125 C 2.804688 -6.066406 1.804688 -7.082031 0.640625 -8.125 L 1.515625 -9.046875 C 2.648438 -7.972656 3.585938 -7 4.328125 -6.125 C 5.078125 -5.257812 5.675781 -4.503906 6.125 -3.859375 C 6.257812 -4.316406 6.335938 -4.84375 6.359375 -5.4375 L 6.125 -11.515625 L 7.453125 -11.515625 L 7.765625 -3.203125 C 7.785156 -2.679688 7.835938 -2.273438 7.921875 -1.984375 C 8.003906 -1.703125 8.1875 -1.503906 8.46875 -1.390625 C 8.757812 -1.285156 9.207031 -1.234375 9.8125 -1.234375 C 10.039062 -1.234375 10.207031 -1.171875 10.3125 -1.046875 C 10.414062 -0.929688 10.46875 -0.785156 10.46875 -0.609375 C 10.46875 -0.441406 10.390625 -0.285156 10.234375 -0.140625 C 10.085938 0.00390625 9.894531 0.078125 9.65625 0.078125 C 8.90625 0.078125 8.304688 0.00390625 7.859375 -0.140625 C 7.421875 -0.285156 7.097656 -0.507812 6.890625 -0.8125 C 6.691406 -1.125 6.5625 -1.519531 6.5 -2 C 6.164062 -1.40625 5.753906 -0.957031 5.265625 -0.65625 C 4.785156 -0.351562 4.285156 -0.15625 3.765625 -0.0625 C 3.242188 0.03125 2.753906 0.078125 2.296875 0.078125 Z M 2.296875 0.078125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(183.232039, 219.186914)">
              <g>
                <path d="M 0 0.078125 L 0.15625 -1.234375 L 0.96875 -1.234375 C 1.132812 -1.503906 1.316406 -1.769531 1.515625 -2.03125 L 1.203125 -11.515625 L 2.515625 -11.515625 L 2.8125 -3.546875 C 3.46875 -4.210938 4.179688 -4.78125 4.953125 -5.25 C 5.734375 -5.71875 6.53125 -5.953125 7.34375 -5.953125 C 7.925781 -5.953125 8.429688 -5.828125 8.859375 -5.578125 C 9.285156 -5.335938 9.613281 -5.015625 9.84375 -4.609375 C 10.070312 -4.203125 10.1875 -3.738281 10.1875 -3.21875 C 10.1875 -2.71875 10.003906 -2.210938 9.640625 -1.703125 C 9.273438 -1.191406 8.644531 -0.789062 7.75 -0.5 C 7.0625 -0.269531 6.234375 -0.113281 5.265625 -0.03125 C 4.304688 0.0390625 3.113281 0.078125 1.6875 0.078125 Z M 7.234375 -4.625 C 6.773438 -4.625 6.3125 -4.507812 5.84375 -4.28125 C 5.375 -4.0625 4.925781 -3.773438 4.5 -3.421875 C 4.070312 -3.078125 3.679688 -2.707031 3.328125 -2.3125 C 2.972656 -1.914062 2.675781 -1.554688 2.4375 -1.234375 L 3.53125 -1.234375 C 5.40625 -1.234375 6.773438 -1.394531 7.640625 -1.71875 C 8.515625 -2.039062 8.953125 -2.546875 8.953125 -3.234375 C 8.953125 -3.421875 8.890625 -3.617188 8.765625 -3.828125 C 8.648438 -4.046875 8.46875 -4.234375 8.21875 -4.390625 C 7.96875 -4.546875 7.640625 -4.625 7.234375 -4.625 Z M 7.234375 -4.625 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(194.14073, 219.186914)">
              <g />
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(198.088483, 219.186914)">
              <g>
                <path d="M 0.484375 0.015625 C 0.484375 -0.367188 0.535156 -0.796875 0.640625 -1.265625 C 0.753906 -1.742188 0.925781 -2.269531 1.15625 -2.84375 L 2.328125 -2.390625 C 2.148438 -1.929688 2.019531 -1.515625 1.9375 -1.140625 C 1.851562 -0.765625 1.8125 -0.414062 1.8125 -0.09375 C 1.8125 0.457031 1.953125 0.914062 2.234375 1.28125 C 2.523438 1.65625 2.921875 1.929688 3.421875 2.109375 C 3.929688 2.296875 4.503906 2.390625 5.140625 2.390625 C 5.859375 2.390625 6.460938 2.289062 6.953125 2.09375 C 7.441406 1.90625 7.832031 1.648438 8.125 1.328125 C 8.414062 1.015625 8.625 0.660156 8.75 0.265625 C 8.875 -0.117188 8.9375 -0.5 8.9375 -0.875 C 8.9375 -1.28125 8.859375 -1.769531 8.703125 -2.34375 C 8.546875 -2.925781 8.257812 -3.648438 7.84375 -4.515625 L 9.046875 -5.125 C 9.359375 -4.5 9.632812 -3.84375 9.875 -3.15625 C 10.113281 -2.46875 10.234375 -1.765625 10.234375 -1.046875 C 10.234375 -0.535156 10.148438 0 9.984375 0.5625 C 9.828125 1.125 9.554688 1.640625 9.171875 2.109375 C 8.785156 2.585938 8.257812 2.972656 7.59375 3.265625 C 6.9375 3.554688 6.113281 3.703125 5.125 3.703125 C 4.289062 3.703125 3.519531 3.570312 2.8125 3.3125 C 2.101562 3.0625 1.535156 2.660156 1.109375 2.109375 C 0.691406 1.566406 0.484375 0.867188 0.484375 0.015625 Z M 5.34375 -6.421875 C 5.125 -6.421875 4.9375 -6.5 4.78125 -6.65625 C 4.625 -6.8125 4.546875 -7 4.546875 -7.21875 C 4.546875 -7.425781 4.625 -7.609375 4.78125 -7.765625 C 4.9375 -7.929688 5.125 -8.015625 5.34375 -8.015625 C 5.5625 -8.015625 5.75 -7.929688 5.90625 -7.765625 C 6.0625 -7.609375 6.140625 -7.425781 6.140625 -7.21875 C 6.140625 -7 6.0625 -6.8125 5.90625 -6.65625 C 5.75 -6.5 5.5625 -6.421875 5.34375 -6.421875 Z M 5.34375 -6.421875 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(209.12608, 219.186914)">
              <g>
                <path d="M 0.9375 3.703125 L 0.640625 2.390625 C 1.328125 2.296875 1.953125 2.160156 2.515625 1.984375 C 3.078125 1.816406 3.554688 1.570312 3.953125 1.25 C 4.347656 0.9375 4.644531 0.507812 4.84375 -0.03125 C 4.644531 0.0195312 4.4375 0.0546875 4.21875 0.078125 C 4.007812 0.109375 3.800781 0.125 3.59375 0.125 C 2.769531 0.125 2.132812 -0.0390625 1.6875 -0.375 C 1.25 -0.707031 1.03125 -1.222656 1.03125 -1.921875 C 1.03125 -2.328125 1.09375 -2.734375 1.21875 -3.140625 C 1.351562 -3.554688 1.535156 -3.9375 1.765625 -4.28125 C 2.003906 -4.632812 2.289062 -4.914062 2.625 -5.125 C 2.957031 -5.332031 3.328125 -5.4375 3.734375 -5.4375 C 4.316406 -5.4375 4.796875 -5.242188 5.171875 -4.859375 C 5.554688 -4.484375 5.84375 -3.992188 6.03125 -3.390625 C 6.226562 -2.785156 6.328125 -2.144531 6.328125 -1.46875 C 6.328125 0.0390625 5.867188 1.226562 4.953125 2.09375 C 4.046875 2.96875 2.707031 3.503906 0.9375 3.703125 Z M 2.3125 -2.234375 C 2.3125 -1.898438 2.414062 -1.632812 2.625 -1.4375 C 2.84375 -1.238281 3.210938 -1.140625 3.734375 -1.140625 C 4.203125 -1.140625 4.644531 -1.207031 5.0625 -1.34375 C 5.0625 -1.40625 5.0625 -1.476562 5.0625 -1.5625 C 5.0625 -2 5 -2.414062 4.875 -2.8125 C 4.757812 -3.207031 4.59375 -3.519531 4.375 -3.75 C 4.164062 -3.988281 3.910156 -4.109375 3.609375 -4.109375 C 3.347656 -4.109375 3.117188 -4.015625 2.921875 -3.828125 C 2.734375 -3.640625 2.582031 -3.398438 2.46875 -3.109375 C 2.363281 -2.816406 2.3125 -2.523438 2.3125 -2.234375 Z M 2.3125 -2.234375 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(216.328717, 219.186914)">
              <g>
                <path d="M 4.6875 0.078125 C 3.820312 0.078125 3.160156 -0.015625 2.703125 -0.203125 C 2.253906 -0.398438 1.941406 -0.703125 1.765625 -1.109375 C 1.597656 -1.515625 1.503906 -2.039062 1.484375 -2.6875 L 1.15625 -11.515625 L 2.484375 -11.515625 L 2.8125 -3.203125 C 2.832031 -2.679688 2.878906 -2.273438 2.953125 -1.984375 C 3.035156 -1.703125 3.21875 -1.503906 3.5 -1.390625 C 3.789062 -1.285156 4.242188 -1.234375 4.859375 -1.234375 C 5.078125 -1.234375 5.238281 -1.171875 5.34375 -1.046875 C 5.445312 -0.929688 5.5 -0.785156 5.5 -0.609375 C 5.5 -0.441406 5.421875 -0.285156 5.265625 -0.140625 C 5.117188 0.00390625 4.925781 0.078125 4.6875 0.078125 Z M 4.6875 0.078125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(221.017681, 219.186914)">
              <g>
                <path d="M 0 0.078125 L 0.15625 -1.234375 C 0.726562 -1.234375 1.269531 -1.28125 1.78125 -1.375 C 2.300781 -1.476562 2.78125 -1.617188 3.21875 -1.796875 C 2.96875 -2.085938 2.679688 -2.390625 2.359375 -2.703125 C 2.035156 -3.015625 1.679688 -3.3125 1.296875 -3.59375 C 1.222656 -3.644531 1.15625 -3.738281 1.09375 -3.875 C 1.03125 -4.019531 0.976562 -4.164062 0.9375 -4.3125 C 0.894531 -4.46875 0.875 -4.582031 0.875 -4.65625 C 0.875 -4.820312 0.972656 -5.015625 1.171875 -5.234375 C 1.378906 -5.460938 1.65625 -5.679688 2 -5.890625 C 2.34375 -6.097656 2.734375 -6.269531 3.171875 -6.40625 C 3.617188 -6.550781 4.078125 -6.625 4.546875 -6.625 C 5.160156 -6.625 5.65625 -6.53125 6.03125 -6.34375 C 6.414062 -6.164062 6.695312 -5.929688 6.875 -5.640625 C 7.050781 -5.359375 7.140625 -5.054688 7.140625 -4.734375 C 7.140625 -4.210938 6.988281 -3.691406 6.6875 -3.171875 C 6.382812 -2.648438 5.972656 -2.171875 5.453125 -1.734375 C 5.910156 -1.566406 6.40625 -1.441406 6.9375 -1.359375 C 7.476562 -1.273438 8.019531 -1.234375 8.5625 -1.234375 C 8.789062 -1.234375 8.953125 -1.171875 9.046875 -1.046875 C 9.148438 -0.929688 9.203125 -0.785156 9.203125 -0.609375 C 9.203125 -0.441406 9.125 -0.285156 8.96875 -0.140625 C 8.820312 0.00390625 8.632812 0.078125 8.40625 0.078125 C 7.695312 0.078125 6.96875 -0.00390625 6.21875 -0.171875 C 5.46875 -0.335938 4.800781 -0.59375 4.21875 -0.9375 C 3.632812 -0.625 2.984375 -0.375 2.265625 -0.1875 C 1.546875 -0.0078125 0.789062 0.078125 0 0.078125 Z M 2.03125 -4.578125 C 2.4375 -4.234375 2.816406 -3.894531 3.171875 -3.5625 C 3.535156 -3.238281 3.941406 -2.84375 4.390625 -2.375 C 4.847656 -2.675781 5.207031 -3 5.46875 -3.34375 C 5.738281 -3.695312 5.875 -4.046875 5.875 -4.390625 C 5.875 -4.597656 5.753906 -4.804688 5.515625 -5.015625 C 5.285156 -5.222656 4.882812 -5.328125 4.3125 -5.328125 C 3.9375 -5.328125 3.523438 -5.253906 3.078125 -5.109375 C 2.640625 -4.972656 2.289062 -4.796875 2.03125 -4.578125 Z M 2.03125 -4.578125 " />
              </g>
            </g>
          </g>
          <g fill="#ffffff" fillOpacity="1">
            <g transform="translate(229.4127, 219.186914)">
              <g>
                <path d="M 0 0.078125 L 0.15625 -1.234375 C 0.78125 -1.234375 1.269531 -1.257812 1.625 -1.3125 C 1.988281 -1.363281 2.242188 -1.484375 2.390625 -1.671875 C 2.546875 -1.867188 2.625 -2.1875 2.625 -2.625 C 2.625 -3.019531 2.53125 -3.53125 2.34375 -4.15625 C 2.15625 -4.78125 1.941406 -5.398438 1.703125 -6.015625 L 3.015625 -6.5 C 3.148438 -6.144531 3.28125 -5.75 3.40625 -5.3125 C 3.53125 -4.875 3.632812 -4.441406 3.71875 -4.015625 C 3.8125 -3.585938 3.859375 -3.210938 3.859375 -2.890625 C 3.859375 -1.796875 3.554688 -1.023438 2.953125 -0.578125 C 2.347656 -0.140625 1.363281 0.078125 0 0.078125 Z M 3.515625 -8.171875 C 3.285156 -8.171875 3.09375 -8.25 2.9375 -8.40625 C 2.78125 -8.5625 2.703125 -8.75 2.703125 -8.96875 C 2.703125 -9.175781 2.78125 -9.359375 2.9375 -9.515625 C 3.09375 -9.679688 3.285156 -9.765625 3.515625 -9.765625 C 3.722656 -9.765625 3.90625 -9.679688 4.0625 -9.515625 C 4.21875 -9.359375 4.296875 -9.175781 4.296875 -8.96875 C 4.296875 -8.75 4.21875 -8.5625 4.0625 -8.40625 C 3.90625 -8.25 3.722656 -8.171875 3.515625 -8.171875 Z M 1.296875 -8.171875 C 1.078125 -8.171875 0.890625 -8.25 0.734375 -8.40625 C 0.578125 -8.5625 0.5 -8.75 0.5 -8.96875 C 0.5 -9.175781 0.578125 -9.359375 0.734375 -9.515625 C 0.890625 -9.679688 1.078125 -9.765625 1.296875 -9.765625 C 1.515625 -9.765625 1.703125 -9.679688 1.859375 -9.515625 C 2.015625 -9.359375 2.09375 -9.175781 2.09375 -8.96875 C 2.09375 -8.75 2.015625 -8.5625 1.859375 -8.40625 C 1.703125 -8.25 1.515625 -8.171875 1.296875 -8.171875 Z M 1.296875 -8.171875 " />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <p className="text-xl font-semibold text-center text-gray-700 mb-6">
        اختر ما تريد القيام به
      </p>
      <div className="flex flex-col gap-4">
        <a
          href="/signup"
          className="bg-[#0b8eca] text-white text-center py-3 rounded-lg hover:bg-[#097bb3] transition duration-300"
        >
          الاشتراك
        </a>
        <a
          href="/login"
          className="bg-gray-100 text-[#0b8eca] text-center py-3 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          تسجيل الدخول
        </a>
      </div>
    </div>
  );
}
