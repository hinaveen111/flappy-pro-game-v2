export function drawBirdShape(
    context: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    color: string, 
    style: string, 
    hat: string, 
    wingType: string, 
    wingFrame: number, 
    rotation = 0
) {
    context.save();
    context.translate(x + 20, y + 20); // Center of bird
    context.rotate(rotation);
    
    const isFlappingDown = Math.sin(wingFrame * 0.4) > 0;
    const wingYOffset = Math.sin(wingFrame * 0.4) * 8;
    
    context.fillStyle = (wingType === 'bat') ? '#333' : (wingType === 'angel' ? '#fff' : 'rgba(255,255,255,0.8)');
    context.strokeStyle = 'rgba(0,0,0,0.4)';
    context.lineWidth = 1.5;

    if (style === 'classic') {
        drawClassic(context, color, wingType, wingYOffset);
    } else if (style === 'realistic') {
        drawCardinal(context, color, wingType, wingYOffset);
    } else if (style === 'parrot') {
        drawParrot(context, color, wingType, wingYOffset);
    } else if (style === 'owl') {
        drawOwl(context, color, wingType, wingYOffset);
    } else if (style === 'eagle') {
        drawEagle(context, color, wingType, wingYOffset);
    } else if (style === 'sparrow') {
        drawSparrow(context, color, wingType, wingYOffset);
    } else if (style === 'woodpecker') {
        drawWoodpecker(context, color, wingType, wingYOffset);
    } else {
        // Fallback to cardinal
        drawCardinal(context, color, wingType, wingYOffset);
    }

    // HATS
    context.translate(0, (style === 'owl' ? -12 : -8));
    if (hat === 'crown') {
        context.fillStyle = '#fbbf24';
        context.beginPath(); context.moveTo(-8, 0); context.lineTo(-10, -10); context.lineTo(-4, -6); context.lineTo(0, -12); context.lineTo(4, -6); context.lineTo(10, -10); context.lineTo(8, 0); context.closePath();
        context.fill(); context.stroke();
    } else if (hat === 'cowboy') {
        context.fillStyle = '#78350f';
        context.fillRect(-12, -2, 24, 3);
        context.fillRect(-7, -8, 14, 7);
    } else if (hat === 'propeller') {
        context.fillStyle = '#3b82f6'; context.fillRect(-7, -6, 14, 6);
        context.fillStyle = '#94a3b8'; context.fillRect(-2, -9, 4, 3);
        context.fillStyle = '#ef4444'; const propX = Math.sin(wingFrame * 0.8) * 12;
        context.fillRect(-10 + propX, -10, 20, 2);
    } else if (hat === 'tophat') {
        context.fillStyle = '#1e293b';
        context.fillRect(-10, -2, 20, 2);
        context.fillRect(-7, -12, 14, 10);
    } else if (hat === 'beanie') {
        context.fillStyle = '#ef4444';
        context.beginPath(); context.arc(0, 0, 8, Math.PI, 0); context.fill();
        context.fillStyle = '#f8fafc'; context.beginPath(); context.arc(0, -9, 3, 0, Math.PI*2); context.fill();
    } else if (hat === 'cap') {
        context.fillStyle = '#3b82f6';
        context.beginPath(); context.arc(0, 0, 7, Math.PI, 0); context.fill();
        context.fillRect(0, -2, 12, 2); // Brim
    } else if (hat === 'helmet') {
        context.fillStyle = '#94a3b8';
        context.beginPath(); context.arc(0, 0, 8, Math.PI, 0); context.fill();
        context.fillStyle = '#fef08a'; context.fillRect(-8, -2, 16, 2); 
    }
    
    context.restore();
}

function drawWing(context: CanvasRenderingContext2D, type: string, yOffset: number, zIndex: number) {
    const isFront = zIndex > 0;
    
    context.beginPath();
    
    if (type === 'bat') {
        context.moveTo(-5, 2); 
        context.quadraticCurveTo(-25, -20 + yOffset, -15, 6); 
        context.fill(); context.stroke();
    } else if (type === 'angel') {
        context.ellipse(-8, 0, 10, Math.abs(yOffset) + 6, Math.PI/6, 0, Math.PI*2); 
        context.fill(); context.stroke();
    } else if (type === 'butterfly') {
        context.fillStyle = isFront ? '#f472b6' : '#db2777';
        context.ellipse(-10, 0, 12, Math.abs(yOffset) + 8, Math.PI/8, 0, Math.PI*2); 
        context.fill(); context.stroke();
    } else if (type === 'swift') {
        context.fillStyle = isFront ? '#e2e8f0' : '#cbd5e1';
        context.moveTo(0, 2);
        context.lineTo(-20, yOffset - 5);
        context.lineTo(-10, 5);
        context.fill(); context.stroke();
    } else if (type === 'glider') {
        context.fillStyle = isFront ? '#bae6fd' : '#7dd3fc';
        context.moveTo(0, 2);
        context.lineTo(-25, yOffset - 2);
        context.lineTo(-18, 4);
        context.fill(); context.stroke();
    } else { // feathery
        context.fillStyle = isFront ? '#ffffff' : '#e2e8f0';
        context.ellipse(-6, 2, 8, Math.abs(yOffset) + 4, -0.2, 0, Math.PI * 2);
        context.fill(); context.stroke();
    }
}

function drawClassic(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    drawWing(context, wingType, wingYOffset, -1);

    // BODY
    context.fillStyle = color;
    context.beginPath(); 
    context.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    // BELLY (Lighter inner color)
    context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context.beginPath();
    context.ellipse(-2, 4, 10, 6, -0.2, 0, Math.PI * 2);
    context.fill();

    // EYE & DETAILS
    context.fillStyle = '#fff';
    context.beginPath(); context.arc(8, -4, 5, 0, Math.PI * 2); context.fill();
    context.stroke();
    context.fillStyle = '#000';
    context.beginPath(); context.arc(10, -4, 2, 0, Math.PI * 2); context.fill();

    // BEAK
    context.fillStyle = '#ff6b6b'; 
    context.beginPath();
    context.moveTo(14, 0);
    context.lineTo(22, 3);
    context.lineTo(14, 6);
    context.fill();
    context.stroke();

    // FRONT WING
    drawWing(context, wingType, wingYOffset, 1);
}

function drawCardinal(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    // Back Wing
    if (wingType === 'feathery') {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(2, -8);
        context.quadraticCurveTo(15, -25 + wingYOffset, 25, -40 + wingYOffset*1.5);
        context.quadraticCurveTo(-5, -25 + wingYOffset, 0, -10);
        context.fill(); context.stroke();
    } else {
        drawWing(context, wingType, wingYOffset, -1);
    }
    
    // Feet
    context.fillStyle = '#FBBF24'; // Yellow
    context.beginPath(); context.ellipse(-2, 16, 2, 4, Math.PI/4, 0, Math.PI * 2); context.fill(); context.stroke();
    context.beginPath(); context.ellipse(6, 17, 2, 4, Math.PI/4, 0, Math.PI * 2); context.fill(); context.stroke();

    // Tail
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(-10, 5);
    context.quadraticCurveTo(-25, 10, -25, 20);
    context.quadraticCurveTo(-15, 15, -5, 12);
    context.fill(); context.stroke();
    
    // Body
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(12, -8); 
    context.quadraticCurveTo(-5, -25, -18, -2); 
    context.quadraticCurveTo(-20, 15, 0, 16); 
    context.quadraticCurveTo(22, 16, 12, -8); 
    context.fill(); context.stroke();

    // White Belly Patch
    context.fillStyle = '#F8FAFC';
    context.beginPath();
    context.moveTo(12, -2);
    context.quadraticCurveTo(-5, 0, -8, 12);
    context.quadraticCurveTo(2, 16, 10, 10);
    context.quadraticCurveTo(18, 5, 12, -2);
    context.fill();

    // Eyes
    const eyeOffset = -6;
    context.fillStyle = '#FFF';
    context.beginPath(); context.ellipse(10, eyeOffset - 2, 4, 6, 0.2, 0, Math.PI * 2); context.fill(); context.stroke();
    context.beginPath(); context.ellipse(2, eyeOffset, 5, 7, 0, 0, Math.PI * 2); context.fill(); context.stroke();

    // Pupils
    context.fillStyle = '#000';
    context.beginPath(); context.arc(11, eyeOffset - 1, 1.5, 0, Math.PI * 2); context.fill();

    // Crest
    context.fillStyle = color;
    context.beginPath(); context.moveTo(-2, -18); context.quadraticCurveTo(-5, -26, -10, -22); context.quadraticCurveTo(-5, -20, -4, -15); context.fill(); context.stroke();

    // Beak
    context.fillStyle = '#FBBF24';
    context.beginPath(); context.moveTo(10, -2); context.quadraticCurveTo(25, -5, 23, 6); context.quadraticCurveTo(15, 4, 10, 2); context.fill(); context.stroke();

    // Front Wing
    if (wingType === 'feathery') {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(-2, 2);
        context.quadraticCurveTo(-20, 25 + wingYOffset, -35, 10 + wingYOffset*1.5);
        context.quadraticCurveTo(-15, -5 + wingYOffset, -5, 0);
        context.fill(); context.stroke();
    } else {
        drawWing(context, wingType, wingYOffset, 1);
    }
}

function drawParrot(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    if (wingType === 'feathery') drawWing(context, 'glider', wingYOffset, -1);
    else drawWing(context, wingType, wingYOffset, -1);
    
    // Feet
    context.fillStyle = '#4B5563';
    context.beginPath(); context.ellipse(-2, 16, 2.5, 4, Math.PI/4, 0, Math.PI * 2); context.fill(); context.stroke();
    context.beginPath(); context.ellipse(5, 17, 2.5, 4, Math.PI/4, 0, Math.PI * 2); context.fill(); context.stroke();

    // Long Tail Feathers
    context.fillStyle = '#1D4ED8'; // Deep blue
    context.beginPath(); context.moveTo(-10, 8); context.quadraticCurveTo(-40, 25, -45, 35); context.quadraticCurveTo(-25, 20, -5, 12); context.fill(); context.stroke();

    context.fillStyle = '#EF4444'; // Red tail feather overlay
    context.beginPath(); context.moveTo(-8, 5); context.quadraticCurveTo(-30, 20, -35, 25); context.quadraticCurveTo(-20, 15, -2, 10); context.fill(); context.stroke();

    // Main Body to Head
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(10, -15);
    context.quadraticCurveTo(-5, -20, -15, 0);
    context.quadraticCurveTo(-20, 15, 0, 16);
    context.quadraticCurveTo(20, 15, 15, -5);
    context.quadraticCurveTo(16, -10, 10, -15);
    context.fill(); context.stroke();

    // Yellow Belly
    context.fillStyle = '#FDE047';
    context.beginPath();
    context.moveTo(12, -2);
    context.quadraticCurveTo(-5, 5, -8, 14);
    context.quadraticCurveTo(5, 15, 10, 10);
    context.quadraticCurveTo(15, 5, 12, -2);
    context.fill();

    // White Macaw Face Patch
    context.fillStyle = '#FFFFFF';
    context.beginPath(); 
    context.moveTo(14, -13);
    context.quadraticCurveTo(5, -15, 2, -8);
    context.quadraticCurveTo(2, -2, 6, 2);
    context.quadraticCurveTo(16, 0, 16, -6);
    context.quadraticCurveTo(16, -10, 14, -13);
    context.fill();

    // Eye
    context.fillStyle = '#000';
    context.beginPath(); context.arc(9, -8, 1.5, 0, Math.PI * 2); context.fill();
    // Eye pale yellow iris
    context.strokeStyle = '#FDE047';
    context.beginPath(); context.arc(9, -8, 2.5, 0, Math.PI * 2); context.stroke();

    // Face lines (macaw skin stripes)
    context.strokeStyle = '#000'; context.lineWidth = 0.5;
    context.beginPath(); context.moveTo(4, -10); context.lineTo(7, -9); context.stroke();
    context.beginPath(); context.moveTo(3, -7); context.lineTo(6, -6); context.stroke();
    context.beginPath(); context.moveTo(4, -4); context.lineTo(8, -3); context.stroke();
    context.lineWidth = 1.5;

    // Pronounced Curved Beak
    // Upper Beak
    context.fillStyle = '#F3F4F6'; // Base of beak
    context.beginPath(); context.moveTo(14, -13); context.quadraticCurveTo(22, -15, 26, -5); context.quadraticCurveTo(28, 5, 22, 5); context.quadraticCurveTo(18, 5, 15, -4); context.fill(); context.stroke();
    
    // Beak tip (dark)
    context.fillStyle = '#374151';
    context.beginPath(); context.moveTo(22, 5); context.quadraticCurveTo(24, 0, 26, -5); context.quadraticCurveTo(28, 5, 22, 5); context.fill();
    
    // Lower Beak
    context.fillStyle = '#111827';
    context.beginPath(); context.moveTo(14, -2); context.lineTo(19, 2); context.quadraticCurveTo(16, 8, 10, 4); context.fill(); context.stroke();

    if (wingType === 'feathery') drawWing(context, 'glider', wingYOffset, 1);
    else drawWing(context, wingType, wingYOffset, 1);
}

function drawOwl(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    drawWing(context, wingType, wingYOffset, -1);
    
    // Feet
    context.fillStyle = '#F59E0B';
    context.beginPath(); context.ellipse(-5, 18, 3, 3, 0, 0, Math.PI*2); context.fill();
    context.beginPath(); context.ellipse(5, 18, 3, 3, 0, 0, Math.PI*2); context.fill();

    // Body plump
    context.fillStyle = color;
    context.beginPath(); context.ellipse(0, 2, 16, 18, 0, 0, Math.PI * 2); context.fill(); context.stroke();

    // Belly feathers
    context.fillStyle = 'rgba(255,255,255,0.3)';
    context.beginPath(); context.ellipse(0, 8, 10, 10, 0, 0, Math.PI*2); context.fill();

    // Big Eyes
    context.fillStyle = '#FFF';
    context.beginPath(); context.arc(5, -4, 7, 0, Math.PI*2); context.fill(); context.stroke();
    context.beginPath(); context.arc(-5, -4, 7, 0, Math.PI*2); context.fill(); context.stroke();
    
    context.fillStyle = '#000';
    context.beginPath(); context.arc(6, -4, 2.5, 0, Math.PI*2); context.fill();
    context.beginPath(); context.arc(-4, -4, 2.5, 0, Math.PI*2); context.fill();

    // Beak small
    context.fillStyle = '#F59E0B';
    context.beginPath(); context.moveTo(-3, 2); context.lineTo(3, 2); context.lineTo(0, 8); context.fill(); context.stroke();

    // Ear tufts
    context.fillStyle = color;
    context.beginPath(); context.moveTo(5, -15); context.lineTo(12, -22); context.lineTo(12, -10); context.fill(); context.stroke();
    context.beginPath(); context.moveTo(-5, -15); context.lineTo(-12, -22); context.lineTo(-12, -10); context.fill(); context.stroke();

    drawWing(context, wingType, wingYOffset, 1);
}

function drawEagle(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    if (wingType === 'feathery') drawWing(context, 'glider', wingYOffset, -1);
    else drawWing(context, wingType, wingYOffset, -1);
    
    // Talons
    context.fillStyle = '#FBBF24';
    context.beginPath(); context.moveTo(-2, 15); context.lineTo(-5, 22); context.lineTo(2, 20); context.fill(); context.stroke();

    // Tail
    context.fillStyle = '#FFFFFF';
    context.beginPath(); context.moveTo(-10, 5); context.lineTo(-25, 10); context.lineTo(-20, 15); context.fill(); context.stroke();

    // Body
    context.fillStyle = color;
    context.beginPath(); context.ellipse(0, 0, 18, 14, -0.1, 0, Math.PI*2); context.fill(); context.stroke();

    // White Head (Bald Eagle)
    context.fillStyle = '#FFFFFF';
    context.beginPath(); context.ellipse(12, -6, 10, 9, 0, 0, Math.PI*2); context.fill(); context.stroke();

    // Fierce Eye
    context.fillStyle = '#FBBF24';
    context.beginPath(); context.arc(14, -8, 3, 0, Math.PI*2); context.fill(); context.stroke();
    context.fillStyle = '#000';
    context.beginPath(); context.arc(15, -8, 1, 0, Math.PI*2); context.fill();
    // Brow
    context.strokeStyle = '#000'; context.lineWidth = 2; context.beginPath(); context.moveTo(11, -11); context.lineTo(17, -9); context.stroke(); context.lineWidth = 1.5;

    // Beak large
    context.fillStyle = '#FBBF24';
    context.beginPath(); context.moveTo(20, -10); context.quadraticCurveTo(35, -5, 25, 5); context.quadraticCurveTo(20, 0, 18, -2); context.fill(); context.stroke();

    if (wingType === 'feathery') drawWing(context, 'glider', wingYOffset, 1);
    else drawWing(context, wingType, wingYOffset, 1);
}

function drawSparrow(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    drawWing(context, wingType, wingYOffset, -1);
    
    // Feet
    context.fillStyle = '#FCA5A5';
    context.beginPath(); context.ellipse(0, 14, 2, 4, 0, 0, Math.PI*2); context.fill();

    // Tiny Tail
    context.fillStyle = color;
    context.beginPath(); context.moveTo(-8, 2); context.lineTo(-18, -2); context.lineTo(-15, 6); context.fill(); context.stroke();

    // Round Body
    context.fillStyle = color;
    context.beginPath(); context.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2); context.fill(); context.stroke();

    // Fluffy Belly
    context.fillStyle = '#F3F4F6';
    context.beginPath(); context.ellipse(-2, 4, 8, 6, 0, 0, Math.PI*2); context.fill();

    // Eye
    context.fillStyle = '#000';
    context.beginPath(); context.arc(6, -3, 2, 0, Math.PI*2); context.fill();

    // Short Beak
    context.fillStyle = '#F59E0B';
    context.beginPath(); context.moveTo(10, -4); context.lineTo(16, -2); context.lineTo(10, 0); context.fill(); context.stroke();

    drawWing(context, wingType, wingYOffset, 1);
}

function drawWoodpecker(context: CanvasRenderingContext2D, color: string, wingType: string, wingYOffset: number) {
    if (wingType === 'feathery') drawWing(context, 'swift', wingYOffset, -1);
    else drawWing(context, wingType, wingYOffset, -1);
    
    // Tail (stiff for propping)
    context.fillStyle = '#111827';
    context.beginPath(); context.moveTo(-10, 5); context.lineTo(-20, 20); context.lineTo(-12, 22); context.fill(); context.stroke();

    // Body
    context.fillStyle = color;
    context.beginPath(); context.ellipse(0, 0, 15, 11, 0.3, 0, Math.PI*2); context.fill(); context.stroke();

    // Red Crest
    context.fillStyle = '#EF4444';
    context.beginPath(); context.moveTo(-5, -15); context.lineTo(5, -20); context.lineTo(12, -10); context.fill(); context.stroke();

    // White Head stripe
    context.fillStyle = '#FFF';
    context.beginPath(); context.ellipse(8, -5, 8, 6, 0.2, 0, Math.PI*2); context.fill(); context.stroke();

    // Eye
    context.fillStyle = '#000';
    context.beginPath(); context.arc(10, -6, 1.5, 0, Math.PI*2); context.fill();

    // Long Beak
    context.fillStyle = '#D1D5DB';
    context.beginPath(); context.moveTo(14, -7); context.lineTo(30, -3); context.lineTo(14, -1); context.fill(); context.stroke();

    if (wingType === 'feathery') drawWing(context, 'swift', wingYOffset, 1);
    else drawWing(context, wingType, wingYOffset, 1);
}

export function drawBackgroundElements(ctx: CanvasRenderingContext2D, w: number, h: number, theme: any, frames: number, currentLevel: number) {
    if (theme.elements.stars) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // Draw static random looking stars
        const starCount = Math.floor(w / 15);
        for (let i = 0; i < starCount; i++) {
            const sx = ((i * 47) + (frames * 0.05)) % w;
            const sy = (i * 97) % (h / 2);
            ctx.beginPath(); ctx.arc(sx, sy, (i % 2 === 0) ? 1.5 : 1, 0, Math.PI * 2); ctx.fill();
        }
    }

    if (theme.elements.clouds) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const cloudSpacing = 200;
        const cloudScroll = (frames * 0.2) % cloudSpacing;
        const cloudCount = Math.ceil(w / cloudSpacing) + 1;
        for (let i = -1; i <= cloudCount; i++) {
            const rx = (i * cloudSpacing) - cloudScroll;
            const ry = 40 + ((Math.abs(i) % 3) * 30);
            drawCloud(ctx, rx, ry, 1 + ((Math.abs(i) % 3) * 0.2));
        }
    }

    if (theme.elements.mountains) {
        ctx.fillStyle = theme.type === 'snow' ? '#E2E8F0' : (theme.type === 'desert' ? '#D2B48C' : '#334155');
        ctx.strokeStyle = theme.type === 'snow' ? '#CBD5E1' : (theme.type === 'desert' ? '#C19A6B' : '#1e293b');
        ctx.lineWidth = 2;
        
        const mntSpacing = theme.type === 'desert' ? 200 : 150;
        const mntScroll = (frames * 0.5) % mntSpacing;
        const mountainCount = Math.ceil(w / mntSpacing) + 1;
        for (let i = -1; i <= mountainCount; i++) {
            const bx = (i * mntSpacing) - mntScroll;
            const by = h - 70; // ground level
            ctx.beginPath();
            ctx.moveTo(bx, by);
            if (theme.type === 'desert') {
                // Dunes are rounded
                ctx.quadraticCurveTo(bx + parseInt((mntSpacing * 0.75).toString()), by - 120, bx + (mntSpacing * 1.5), by);
            } else {
                // Mountains are jagged
                ctx.lineTo(bx + parseInt((mntSpacing * 0.6).toString()), by - 180 + (Math.abs(i)%2)*40);
                ctx.lineTo(bx + (mntSpacing * 1.3), by);
            }
            ctx.fill(); ctx.stroke();
        }
    }

    if (theme.elements.trees) {
        ctx.fillStyle = theme.type === 'night' ? '#0f172a' : '#166534';
        const trunkCol = theme.type === 'night' ? '#020617' : '#78350f';
        
        const treeSpacing = 80;
        const treeScroll = (frames * 1.5) % treeSpacing;
        const treeCount = Math.ceil(w / treeSpacing) + 1;
        
        for (let i = -1; i <= treeCount; i++) {
            const tx = (i * treeSpacing) - treeScroll;

            const ty = h - 70;
            
            // Trunk
            ctx.fillStyle = trunkCol;
            ctx.fillRect(tx - 4, ty - 30, 8, 30);
            
            // Leaves
            ctx.fillStyle = theme.type === 'snow' ? '#f8fafc' : (theme.type === 'night' ? '#1e293b' : '#166534');
            ctx.beginPath();
            ctx.moveTo(tx - 20, ty - 25);
            ctx.lineTo(tx, ty - 60);
            ctx.lineTo(tx + 20, ty - 25);
            ctx.fill();
            
            if (!theme.type.startsWith('night') && !theme.type.startsWith('snow')) {
                 ctx.fillStyle = '#22c55e';
                 ctx.beginPath();
                 ctx.moveTo(tx - 15, ty - 40);
                 ctx.lineTo(tx, ty - 75);
                 ctx.lineTo(tx + 15, ty - 40);
                 ctx.fill();
            }
        }
    }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, -10, 25, 0, Math.PI * 2);
    ctx.arc(50, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, 10, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
