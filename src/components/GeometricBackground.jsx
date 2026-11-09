import React, { useEffect, useRef } from 'react';

export default function GeometricBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Geometric Shapes & Nodes
    const NODE_COUNT = Math.min(38, Math.floor((width * height) / 32000));
    const nodes = [];

    const colors = [
      { r: 0, g: 240, b: 255 },   // Cyan
      { r: 255, g: 0, b: 127 },   // Magenta / Pink
      { r: 157, g: 78, b: 221 },  // Electric Violet
      { r: 0, g: 255, b: 157 }    // Matrix Emerald
    ];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[i % colors.length],
        shape: i % 4, // 0: circle, 1: triangle, 2: hexagon, 3: diamond
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle drifting cyberpunk perspective grid
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      const offsetX = (mouse.x - width / 2) * 0.04;
      const offsetY = (mouse.y - height / 2) * 0.04;

      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Interconnecting Vector Lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Geometric Polygons & Pulse Nodes
      nodes.forEach((node) => {
        // Move with bounce
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const pulse = Math.sin(time + node.pulseOffset) * 0.3 + 0.85;
        const { r, g, b } = node.color;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);

        // Glow aura
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 * pulse})`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * pulse})`;
        ctx.lineWidth = 1.2;

        const size = node.radius * 3.8 * pulse;

        if (node.shape === 0) {
          // Circle node
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (node.shape === 1) {
          // Equilateral Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.866, size * 0.5);
          ctx.lineTo(-size * 0.866, size * 0.5);
          ctx.closePath();
          ctx.stroke();
        } else if (node.shape === 2) {
          // Hexagon
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const angle = (s * Math.PI) / 3;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else {
          // Diamond / Rhombus
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.2);
          ctx.lineTo(size * 0.8, 0);
          ctx.lineTo(0, size * 1.2);
          ctx.lineTo(-size * 0.8, 0);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.95
      }}
    />
  );
}

