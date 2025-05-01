// src/components/ParticleBackground.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      className="-z-10 bg-red-800"
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        particles: {
          number: {
            value: 115,
            density: {
              enable: false,
              area: 2720,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#ffffff",
            },
            polygon: {
              sides: 12,
            },
          },
          opacity: {
            value: 0.44,
            random: true,
            animation: {
              enable: false,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: 1,
            random: false,
            animation: {
              enable: false,
              speed: 40,
              minimumValue: 0.1,
              sync: false,
            },
          },
          links: {
            enable: true,
            distance: 208,
            color: "#ffffff",
            opacity: 0.4,
            width: 0.8,
          },
          move: {
            enable: true,
            speed: 6.4,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out",
            },
            bounce: false,
            attract: {
              enable: false,
              rotate: {
                x: 0,
                y: 0,
              },
            },
          },
        },
        interactivity: {
          detect_on: "window",
          events: {
            onHover: {
              enable: false,
              mode: "grab",
            },
            onClick: {
              enable: false,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 0,
              links: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
            remove: {
              quantity: 2,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
