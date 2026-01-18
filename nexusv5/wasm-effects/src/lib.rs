use wasm_bindgen::prelude::*;

/// High-performance particle system running in WebAssembly
/// V2: Intelligent flow that avoids center content
#[wasm_bindgen]
pub struct ParticleSystem {
    positions: Vec<f32>,     // x, y, z for each particle
    velocities: Vec<f32>,    // vx, vy, vz for each particle
    colors: Vec<f32>,        // r, g, b for each particle
    sizes: Vec<f32>,         // size for each particle
    angles: Vec<f32>,        // orbital angle for each particle
    count: usize,
    time: f32,
}

#[wasm_bindgen]
impl ParticleSystem {
    /// Create a new particle system with intelligent distribution
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize) -> ParticleSystem {
        let mut positions = Vec::with_capacity(count * 3);
        let mut velocities = Vec::with_capacity(count * 3);
        let mut colors = Vec::with_capacity(count * 3);
        let mut sizes = Vec::with_capacity(count);
        let mut angles = Vec::with_capacity(count);

        for i in 0..count {
            // Create particles in orbital rings around the edges
            // Avoid center where text is displayed
            let ring = (i % 5) as f32; // 5 orbital rings
            let base_radius = 35.0 + ring * 12.0; // Rings from 35 to 83 units out
            
            let angle = (i as f32 / count as f32) * std::f32::consts::PI * 2.0 * 7.0; // Spiral
            angles.push(angle);
            
            // Position in ring (edges of screen)
            let x = angle.cos() * base_radius;
            let y = angle.sin() * base_radius * 0.6; // Flatten vertically
            let z = -20.0 - (js_sys::Math::random() as f32) * 30.0;
            
            positions.push(x);
            positions.push(y);
            positions.push(z);
            
            // Orbital velocity (circular motion around center)
            let speed = 0.01 + (js_sys::Math::random() as f32) * 0.005;
            velocities.push(speed); // Store as angular velocity
            velocities.push(0.0);
            velocities.push(0.0);
            
            // Cyberpunk colors (purple, pink, cyan)
            let color_choice = i % 5;
            match color_choice {
                0 => { colors.push(0.6); colors.push(0.2); colors.push(0.9); } // Purple
                1 => { colors.push(0.9); colors.push(0.2); colors.push(0.6); } // Pink
                2 => { colors.push(0.2); colors.push(0.8); colors.push(0.9); } // Cyan
                3 => { colors.push(0.4); colors.push(0.2); colors.push(0.9); } // Blue-purple
                _ => { colors.push(0.8); colors.push(0.4); colors.push(0.9); } // Light purple
            }
            
            // Smaller sizes for cleaner look
            sizes.push(js_sys::Math::random() as f32 * 1.5 + 0.3);
        }

        ParticleSystem {
            positions,
            velocities,
            colors,
            sizes,
            angles,
            count,
            time: 0.0,
        }
    }

    /// Update all particles - orbital flow around edges + Fluid Coupling
    pub fn update(&mut self, delta_time: f32, mouse_x: f32, mouse_y: f32, 
                  fluid_vx_ptr: usize, fluid_vy_ptr: usize, fluid_size: usize) {
        self.time += delta_time;
        
        let fluid_vx_slice: &[f32];
        let fluid_vy_slice: &[f32];
        
        // Safety: We assume the pointers come from the valid FluidSimulator in the same WASM memory
        if fluid_size > 0 && fluid_vx_ptr != 0 && fluid_vy_ptr != 0 {
            unsafe {
                fluid_vx_slice = std::slice::from_raw_parts(fluid_vx_ptr as *const f32, fluid_size * fluid_size);
                fluid_vy_slice = std::slice::from_raw_parts(fluid_vy_ptr as *const f32, fluid_size * fluid_size);
            }
        } else {
            fluid_vx_slice = &[];
            fluid_vy_slice = &[];
        }

        for i in 0..self.count {
            let idx = i * 3;
            
            // Get angular velocity
            let angular_speed = self.velocities[idx];
            
            // Update angle (orbital motion) - Base motion
            self.angles[i] += angular_speed * delta_time * 60.0;
            
            // Calculate ring based on particle index
            let ring = (i % 5) as f32;
            let base_radius = 35.0 + ring * 12.0;
            
            // Add wave effect to radius
            let wave_radius = base_radius + (self.time * 0.5 + ring).sin() * 3.0;
            
            // Calculate base position (orbital)
            let angle = self.angles[i];
            let mut x = angle.cos() * wave_radius;
            let mut y = angle.sin() * wave_radius * 0.6; // Keep vertical compression
            let mut z = self.positions[idx + 2];
            
            // --- FLUID COUPLING ---
            // Map Particle (approx -100..100) to Fluid Grid (0..fluid_size)
            // Screen mapping: [-100, 100] -> [0, fluid_size]
            if !fluid_vx_slice.is_empty() {
                let map_x = ((x + 100.0) / 200.0 * fluid_size as f32) as isize;
                let map_y = ((-y + 100.0) / 200.0 * fluid_size as f32) as isize; // Y is inverted in 3D usually vs Canvas
                
                if map_x >= 0 && map_x < fluid_size as isize && map_y >= 0 && map_y < fluid_size as isize {
                    let f_idx = (map_x as usize) + (map_y as usize) * fluid_size;
                    let f_vx = fluid_vx_slice[f_idx];
                    let f_vy = fluid_vy_slice[f_idx];
                    
                    // Apply fluid velocity to position
                    // Scale factor for visibility
                    x += f_vx * 5.0; 
                    y += -f_vy * 5.0; // Invert Y
                }
            }
            
            // Add subtle Z oscillation
            z = -20.0 - ring * 5.0 + (self.time * 0.3 + i as f32 * 0.01).sin() * 5.0;
            
            // Mouse repulsion from center (push particles outward)
            let dx = x - mouse_x * 0.5;
            let dy = y - mouse_y * 0.5;
            let dist_to_mouse = (dx * dx + dy * dy).sqrt().max(10.0);
            
            if dist_to_mouse < 30.0 {
                let repel = (30.0 - dist_to_mouse) / 30.0 * 5.0;
                let norm_x = dx / dist_to_mouse;
                let norm_y = dy / dist_to_mouse;
                x += norm_x * repel;
                y += norm_y * repel;
            }
            
            // Update positions
            self.positions[idx] = x;
            self.positions[idx + 1] = y;
            self.positions[idx + 2] = z;
            
            // Pulse sizes gently
            let base_size = self.sizes[i];
            let pulse = 1.0 + (self.time * 1.5 + i as f32 * 0.05).sin() * 0.15;
            self.sizes[i] = (base_size * pulse).max(0.2).min(2.5);
        }
    }

    /// Get pointer to positions array for Three.js
    pub fn positions_ptr(&self) -> *const f32 {
        self.positions.as_ptr()
    }

    /// Get pointer to colors array
    pub fn colors_ptr(&self) -> *const f32 {
        self.colors.as_ptr()
    }

    /// Get pointer to sizes array
    pub fn sizes_ptr(&self) -> *const f32 {
        self.sizes.as_ptr()
    }

    /// Get particle count
    pub fn count(&self) -> usize {
        self.count
    }
    
    /// Get current time
    pub fn time(&self) -> f32 {
        self.time
    }
}

/// Initialize the module with panic hook
#[wasm_bindgen]
pub fn init_hooks() {
    console_error_panic_hook::set_once();
}

/// ==========================================
/// FLUID SIMULATION (Navier-Stokes based)
/// ==========================================

#[wasm_bindgen]
pub struct FluidSimulator {
    size: usize,
    dt: f32,
    diff: f32,
    visc: f32,
    density: Vec<f32>,
    s: Vec<f32>,
    vx: Vec<f32>,
    vy: Vec<f32>,
    vx0: Vec<f32>,
    vy0: Vec<f32>,
}

#[wasm_bindgen]
impl FluidSimulator {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize, dt: f32, diffusion: f32, viscosity: f32) -> FluidSimulator {
        let len = size * size;
        FluidSimulator {
            size,
            dt,
            diff: diffusion,
            visc: viscosity,
            density: vec![0.0; len],
            s: vec![0.0; len],
            vx: vec![0.0; len],
            vy: vec![0.0; len],
            vx0: vec![0.0; len],
            vy0: vec![0.0; len],
        }
    }

    pub fn add_density(&mut self, x: usize, y: usize, amount: f32) {
        let index = self.get_index(x, y);
        self.density[index] += amount;
    }

    pub fn add_velocity(&mut self, x: usize, y: usize, amount_x: f32, amount_y: f32) {
        let index = self.get_index(x, y);
        self.vx[index] += amount_x;
        self.vy[index] += amount_y;
    }

    pub fn step(&mut self) {
        let visc = self.visc;
        let diff = self.diff;
        let dt = self.dt;
        let vx = &mut self.vx;
        let vy = &mut self.vy;
        let vx0 = &mut self.vx0;
        let vy0 = &mut self.vy0;
        let s = &mut self.s;
        let density = &mut self.density;

        diffuse(1, vx0, vx, visc, dt, self.size);
        diffuse(2, vy0, vy, visc, dt, self.size);

        project(vx0, vy0, vx, vy, self.size);

        advect(1, vx, vx0, vx0, vy0, dt, self.size);
        advect(2, vy, vy0, vx0, vy0, dt, self.size);

        project(vx, vy, vx0, vy0, self.size);

        diffuse(0, s, density, diff, dt, self.size);
        advect(0, density, s, vx, vy, dt, self.size);
    }

    pub fn density_ptr(&self) -> *const f32 {
        self.density.as_ptr()
    }

    pub fn vx_ptr(&self) -> *const f32 {
        self.vx.as_ptr()
    }

    pub fn vy_ptr(&self) -> *const f32 {
        self.vy.as_ptr()
    }

    fn get_index(&self, x: usize, y: usize) -> usize {
        let x = x.clamp(0, self.size - 1);
        let y = y.clamp(0, self.size - 1);
        x + y * self.size
    }
}

fn set_bnd(b: usize, x: &mut [f32], N: usize) {
    for i in 1..N - 1 {
        x[i + 0 * N] = if b == 2 { -x[i + 1 * N] } else { x[i + 1 * N] };
        x[i + (N - 1) * N] = if b == 2 { -x[i + (N - 2) * N] } else { x[i + (N - 2) * N] };
    }
    for j in 1..N - 1 {
        x[0 + j * N] = if b == 1 { -x[1 + j * N] } else { x[1 + j * N] };
        x[(N - 1) + j * N] = if b == 1 { -x[(N - 2) + j * N] } else { x[(N - 2) + j * N] };
    }

    x[0 + 0 * N] = 0.5 * (x[1 + 0 * N] + x[0 + 1 * N]);
    x[0 + (N - 1) * N] = 0.5 * (x[1 + (N - 1) * N] + x[0 + (N - 2) * N]);
    x[(N - 1) + 0 * N] = 0.5 * (x[(N - 2) + 0 * N] + x[(N - 1) + 1 * N]);
    x[(N - 1) + (N - 1) * N] = 0.5 * (x[(N - 2) + (N - 1) * N] + x[(N - 1) + (N - 2) * N]);
}

fn lin_solve(b: usize, x: &mut [f32], x0: &[f32], a: f32, c: f32, N: usize) {
    let cRecip = 1.0 / c;
    for _k in 0..4 {
        for j in 1..N - 1 {
            for i in 1..N - 1 {
                x[i + j * N] =
                    (x0[i + j * N] + a * (x[i + 1 + j * N] + x[i - 1 + j * N] + x[i + (j + 1) * N] + x[i + (j - 1) * N]))
                        * cRecip;
            }
        }
        set_bnd(b, x, N);
    }
}

fn diffuse(b: usize, x: &mut [f32], x0: &[f32], diff: f32, dt: f32, N: usize) {
    let a = dt * diff * ((N - 2) * (N - 2)) as f32;
    lin_solve(b, x, x0, a, 1.0 + 6.0 * a, N);
}

fn project(velocX: &mut [f32], velocY: &mut [f32], p: &mut [f32], div: &mut [f32], N: usize) {
    for j in 1..N - 1 {
        for i in 1..N - 1 {
            div[i + j * N] = -0.5
                * (velocX[i + 1 + j * N] - velocX[i - 1 + j * N] + velocY[i + (j + 1) * N] - velocY[i + (j - 1) * N])
                / N as f32;
            p[i + j * N] = 0.0;
        }
    }
    set_bnd(0, div, N);
    set_bnd(0, p, N);
    lin_solve(0, p, div, 1.0, 6.0, N);

    for j in 1..N - 1 {
        for i in 1..N - 1 {
            velocX[i + j * N] -= 0.5 * (p[i + 1 + j * N] - p[i - 1 + j * N]) * N as f32;
            velocY[i + j * N] -= 0.5 * (p[i + (j + 1) * N] - p[i + (j - 1) * N]) * N as f32;
        }
    }
    set_bnd(1, velocX, N);
    set_bnd(2, velocY, N);
}

fn advect(b: usize, d: &mut [f32], d0: &[f32], velocX: &[f32], velocY: &[f32], dt: f32, N: usize) {
    let mut i0: f32;
    let mut i1: f32;
    let mut j0: f32;
    let mut j1: f32;

    let dtx = dt * (N - 2) as f32;
    let dty = dt * (N - 2) as f32;

    let mut s0: f32;
    let mut s1: f32;
    let mut t0: f32;
    let mut t1: f32;
    let mut tmp1: f32;
    let mut tmp2: f32;
    let mut x: f32;
    let mut y: f32;

    let Nfloat = N as f32;

    for j in 1..N - 1 {
        for i in 1..N - 1 {
            tmp1 = dtx * velocX[i + j * N];
            tmp2 = dty * velocY[i + j * N];
            x = i as f32 - tmp1;
            y = j as f32 - tmp2;

            if x < 0.5 { x = 0.5; }
            if x > Nfloat + 0.5 { x = Nfloat + 0.5; }
            i0 = x.floor();
            i1 = i0 + 1.0;
            if y < 0.5 { y = 0.5; }
            if y > Nfloat + 0.5 { y = Nfloat + 0.5; }
            j0 = y.floor();
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            let i0_u = i0 as usize;
            let i1_u = i1 as usize;
            let j0_u = j0 as usize;
            let j1_u = j1 as usize;

            d[i + j * N] = s0 * (t0 * d0[i0_u + j0_u * N] + t1 * d0[i0_u + j1_u * N])
                        + s1 * (t0 * d0[i1_u + j0_u * N] + t1 * d0[i1_u + j1_u * N]);
        }
    }
    set_bnd(b, d, N);
}
