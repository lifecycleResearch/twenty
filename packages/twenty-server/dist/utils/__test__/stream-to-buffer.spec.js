"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _stream = require("stream");
const _streamtobuffer = require("../stream-to-buffer");
describe('streamToBuffer', ()=>{
    describe('successful scenarios', ()=>{
        it('should convert a stream with single chunk to buffer', async ()=>{
            const testData = 'Hello, World!';
            const stream = _stream.Readable.from([
                Buffer.from(testData)
            ]);
            const result = await (0, _streamtobuffer.streamToBuffer)(stream);
            expect(result.toString()).toBe(testData);
        });
        it('should convert a stream with multiple chunks to buffer', async ()=>{
            const chunks = [
                'Hello, ',
                'World',
                '!'
            ];
            const stream = _stream.Readable.from(chunks.map((chunk)=>Buffer.from(chunk)));
            const result = await (0, _streamtobuffer.streamToBuffer)(stream);
            expect(result.toString()).toBe('Hello, World!');
        });
        it('should handle empty stream', async ()=>{
            const stream = _stream.Readable.from([]);
            const result = await (0, _streamtobuffer.streamToBuffer)(stream);
            expect(result.length).toBe(0);
            expect(result.toString()).toBe('');
        });
    });
    describe('error scenarios', ()=>{
        it('should reject when stream is already ended', async ()=>{
            const stream = _stream.Readable.from([
                Buffer.from('test')
            ]);
            await (0, _streamtobuffer.streamToBuffer)(stream);
            await expect((0, _streamtobuffer.streamToBuffer)(stream)).rejects.toThrow('Stream has already ended');
        });
        it('should reject when stream is not readable (destroyed)', async ()=>{
            const stream = new _stream.PassThrough();
            stream.destroy();
            await expect((0, _streamtobuffer.streamToBuffer)(stream)).rejects.toThrow('Stream is not readable');
        });
        it('should reject when stream emits an error', async ()=>{
            const stream = new _stream.PassThrough();
            const testError = new Error('Stream error');
            const promise = (0, _streamtobuffer.streamToBuffer)(stream);
            stream.write(Buffer.from('partial'));
            stream.emit('error', testError);
            await expect(promise).rejects.toThrow('Stream error');
        });
        it('should reject when stream closes before end', async ()=>{
            const stream = new _stream.PassThrough();
            const promise = (0, _streamtobuffer.streamToBuffer)(stream);
            stream.write(Buffer.from('data'));
            stream.destroy();
            await expect(promise).rejects.toThrow('Stream closed before end');
        });
    });
});

//# sourceMappingURL=stream-to-buffer.spec.js.map