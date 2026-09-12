<script lang="ts">
	import * as THREE from 'three';

	function bg(node: HTMLDivElement) {
		const scene = new THREE.Scene();
		const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 40);
		cam.position.z = 8;
		const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		r.setClearColor(0x000000, 0);
		r.setPixelRatio(Math.min(devicePixelRatio, 2));
		node.appendChild(r.domElement);
		const fit = () => {
			const w = node.clientWidth || innerWidth;
			const h = node.clientHeight || innerHeight;
			r.setSize(w, h);
			cam.aspect = w / h;
			cam.updateProjectionMatrix();
		};
		fit();
		const mats = [0xb026ff, 0xff2bd6, 0x22f0ff].map((c) => new THREE.LineBasicMaterial({ color: c }));
		const meshes = [0, 1, 2].map((i) => {
			const m = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.2 + i * 0.4, 0)), mats[i]);
			m.position.set((i - 1) * 3.2, i === 1 ? 1.2 : -0.6, -i);
			scene.add(m);
			return m;
		});
		const pts = new THREE.BufferGeometry();
		const n = 180;
		const arr = new Float32Array(n * 3);
		for (let i = 0; i < n * 3; i++) arr[i] = (Math.random() - 0.5) * 18;
		pts.setAttribute('position', new THREE.BufferAttribute(arr, 3));
		const stars = new THREE.Points(pts, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04 }));
		scene.add(stars);
		let raf = 0;
		const tick = () => {
			meshes.forEach((m, i) => {
				m.rotation.x += 0.004 + i * 0.002;
				m.rotation.y += 0.006 + i * 0.002;
			});
			stars.rotation.y += 0.0008;
			r.render(scene, cam);
			raf = requestAnimationFrame(tick);
		};
		tick();
		addEventListener('resize', fit);
		return {
			destroy() {
				cancelAnimationFrame(raf);
				removeEventListener('resize', fit);
				r.dispose();
			}
		};
	}
</script>

<div use:bg class="pointer-events-none fixed inset-0 -z-10"></div>
