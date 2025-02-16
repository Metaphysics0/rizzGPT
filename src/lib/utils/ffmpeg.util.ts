import type { LogEvent } from '@ffmpeg/ffmpeg';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function transcode(videoURL: string) {
	const ffmpeg = await loadFFmpeg();
	await ffmpeg.writeFile('test.avi', await fetchFile(videoURL));
	await ffmpeg.exec(['-i', 'test.avi', 'test.mp4']);
	const data = await ffmpeg.readFile('test.mp4');
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

async function loadFFmpeg() {
	const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
	const ffmpeg = new FFmpeg();
	let message = 'Loading ffmpeg-core.js';
	ffmpeg.on('log', ({ message: msg }: LogEvent) => {
		message = msg;
		console.log(message);
	});
	await ffmpeg.load({
		coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
		wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
		workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
	});
	return ffmpeg;
}
