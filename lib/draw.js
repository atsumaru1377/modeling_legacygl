const sampleDraw = (color, samples) => {
	const num_sample = samples.length;
	legacygl.color(color[0], color[1], color[2]);

	// draw line segments composing curve
	legacygl.begin(gl.LINE_STRIP);
	for (let i = 0; i < num_sample; ++i) {
		legacygl.vertex2(samples[i]);
	}
	legacygl.end();

	// draw sample points
	if (document.getElementById("input_show_samplepoints").checked) {
		legacygl.begin(gl.POINTS);
		for (let i = 0; i < num_sample; ++i) {
			legacygl.vertex2(samples[i]);
		}
		legacygl.end();
	}
};

export {
	sampleDraw
}

