import { useEffect, useRef, useState } from "react";
import { FaUserGraduate, FaUsers, FaBook, FaLightbulb, FaAward, FaHandshake } from "react-icons/fa";

export default function TafawouqMainCanvas() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Enhanced color palette that aligns with TAFAWOUQ theme
    const colors = [
      "#08beca", // Primary blue
      "#0a9eb8", // Darker blue
      "#ff6b5d", // Accent orange/red
      "#ff8a7f", // Lighter orange
      "#ffffff", // White
      "#e6f7fa", // Very light blue
    ];

    // Define icons that represent TAFAWOUQ values
    const icons = [
      { component: FaUserGraduate, meaning: "Learning" },
      { component: FaUsers, meaning: "Collaboration" },
      { component: FaBook, meaning: "Knowledge" },
      { component: FaLightbulb, meaning: "Ideas" },
      { component: FaAward, meaning: "Achievement" },
      { component: FaHandshake, meaning: "Cooperation" },
    ];

    // Create more particles for a richer visual
    const particles = [];
    const particleCount = Math.min(Math.floor(width * height / 10000), 150); // Responsive count based on screen size
    const iconParticleCount = Math.min(Math.floor(particleCount * 0.2), 15); // 20% of particles will be icons

    // First create regular particles
    for (let i = 0; i < particleCount - iconParticleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1, // Varied sizes
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3, // Varied opacity
        // Properties for connection visualization
        connections: [],
        connectionStrength: 0,
        // Properties for interactive behavior
        originalSize: Math.random() * 3 + 1,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAmount: Math.random() * 0.5 + 0.5,
        isIcon: false,
      });
    }
    
    // Then add icon particles - distribute them more evenly across the canvas
    for (let i = 0; i < iconParticleCount; i++) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      // Calculate position to distribute icons more evenly
      const gridCols = Math.ceil(Math.sqrt(iconParticleCount));
      const gridRows = Math.ceil(iconParticleCount / gridCols);
      const colWidth = width / gridCols;
      const rowHeight = height / gridRows;
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      
      // Add some randomness to the grid position
      const x = colWidth * (col + 0.3 + Math.random() * 0.4);
      const y = rowHeight * (row + 0.3 + Math.random() * 0.4);
      
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 10 + 15, // Make icons even larger and more visible
        speedX: (Math.random() - 0.5) * 0.5, // Even slower movement
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.2 + 0.8, // More visible
        connections: [],
        connectionStrength: 0,
        originalSize: Math.random() * 10 + 15,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        pulseSpeed: Math.random() * 0.008 + 0.003, // Slower pulse
        pulseAmount: Math.random() * 0.2 + 0.1,
        isIcon: true,
        icon: randomIcon.component,
        meaning: randomIcon.meaning,
      });
    }

    // Function to draw connections between particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        particles[i].connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect particles that are close enough
          const connectionDistance = width * 0.1; // Responsive connection distance
          if (distance < connectionDistance) {
            // Calculate connection opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            particles[i].connections.push({ particle: particles[j], opacity });
          }
        }
      }

      // Draw the connections
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        for (const connection of particle.connections) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connection.particle.x, connection.particle.y);
          
          // Gradient line for more aesthetic appeal
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y, 
            connection.particle.x, connection.particle.y
          );
          gradient.addColorStop(0, particle.color.replace(')', `, ${connection.opacity * 0.5})`).replace('rgb', 'rgba'));
          gradient.addColorStop(1, connection.particle.color.replace(')', `, ${connection.opacity * 0.5})`).replace('rgb', 'rgba'));
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = connection.opacity * 1.5;
          ctx.stroke();
        }
      }
    };

    // Function to handle mouse interaction
    const handleMouseInteraction = () => {
      if (!isInteracting || !mousePosition.x || !mousePosition.y) return;
      
      const interactionRadius = 150;
      
      particles.forEach(particle => {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < interactionRadius) {
          // Attract particles to mouse position
          const force = (interactionRadius - distance) / interactionRadius;
          particle.x += dx * force * 0.05;
          particle.y += dy * force * 0.05;
          
          // Increase particle size temporarily
          particle.size = particle.originalSize * (1 + force);
          particle.connectionStrength = force;
        }
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
        
        // Pulse effect for size
        particle.size += particle.pulseDirection * particle.pulseSpeed * particle.pulseAmount;
        if (particle.size > particle.originalSize * 1.5 || particle.size < particle.originalSize * 0.5) {
          particle.pulseDirection *= -1;
        }
        
        // Draw particle based on type (regular or icon)
        if (particle.isIcon) {
          // Save current context state
          ctx.save();
          
          // Set fill style for icon
          ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
          
          // Draw icon background glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity * 0.4})`).replace('rgb', 'rgba');
          ctx.fill();
          
          // Draw a glowing circle background for the icon
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 1.2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, 0.7)`).replace('rgb', 'rgba');
          ctx.fill();
          
          // Add outer glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, 0.3)`).replace('rgb', 'rgba');
          ctx.fill();
          
          // Draw the emoji icon
          ctx.font = `${particle.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Use emoji representation based on the meaning
          let iconChar = '★'; // Default star
          if (particle.meaning === 'Learning') iconChar = '🎓';
          if (particle.meaning === 'Collaboration') iconChar = '👥';
          if (particle.meaning === 'Knowledge') iconChar = '📚';
          if (particle.meaning === 'Ideas') iconChar = '💡';
          if (particle.meaning === 'Achievement') iconChar = '🏆';
          if (particle.meaning === 'Cooperation') iconChar = '🤝';
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(iconChar, particle.x, particle.y);
          
          // Draw meaning text with shadow for better visibility
          if (particle.size > 15) {
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            
            // Add text shadow for better visibility
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            ctx.fillText(particle.meaning, particle.x, particle.y + particle.size + 10);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
          
          // Restore context state
          ctx.restore();
        } else {
          // Draw regular particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
          ctx.fill();
          
          // Add glow effect for some particles
          if (Math.random() < 0.3 || particle.connectionStrength > 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity * 0.3})`).replace('rgb', 'rgba');
            ctx.fill();
          }
        }
        
        // Reset connection strength
        particle.connectionStrength = 0;
      });
      
      // Draw connections between particles
      drawConnections();
      
      // Handle mouse interaction
      handleMouseInteraction();
      
      requestAnimationFrame(animate);
    };

    animate();

    // Event listeners for mouse interaction
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => {
      setIsInteracting(true);
    };
    
    const handleMouseUp = () => {
      setIsInteracting(false);
    };
    
    const handleTouchStart = (e) => {
      setIsInteracting(true);
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    
    const handleTouchEnd = () => {
      setIsInteracting(false);
    };

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mousePosition, isInteracting]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[1]"
      style={{
        background: "linear-gradient(135deg, rgba(8,190,202,0.8), rgba(255,107,93,0.8))",
      }}
    />
  );
}
