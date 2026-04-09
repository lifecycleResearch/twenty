"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _parseemailbody = require("../parse-email-body");
describe('parseEmailBody', ()=>{
    it('should parse valid JSON content', ()=>{
        const jsonContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello World'
                        }
                    ]
                }
            ]
        };
        const result = (0, _parseemailbody.parseEmailBody)(JSON.stringify(jsonContent));
        expect(result).toEqual(jsonContent);
    });
    it('should return plain string when JSON parsing fails', ()=>{
        const plainText = 'This is plain text, not JSON';
        const result = (0, _parseemailbody.parseEmailBody)(plainText);
        expect(result).toBe(plainText);
    });
    it('should parse JSON content with hardBreak nodes', ()=>{
        const jsonWithHardBreaks = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Line 1'
                        },
                        {
                            type: 'hardBreak'
                        },
                        {
                            type: 'text',
                            text: 'Line 2'
                        }
                    ]
                }
            ]
        };
        const result = (0, _parseemailbody.parseEmailBody)(JSON.stringify(jsonWithHardBreaks));
        expect(result).toEqual(jsonWithHardBreaks);
        expect(result.content[0].content).toContainEqual({
            type: 'hardBreak'
        });
    });
    it('should handle empty string', ()=>{
        const result = (0, _parseemailbody.parseEmailBody)('');
        expect(result).toBe('');
    });
    it('should handle JSON array format', ()=>{
        const arrayContent = [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'Content'
                    }
                ]
            }
        ];
        const result = (0, _parseemailbody.parseEmailBody)(JSON.stringify(arrayContent));
        expect(result).toEqual(arrayContent);
    });
});

//# sourceMappingURL=parse-email-body.spec.js.map