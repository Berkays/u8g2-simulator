
declare module "*.bdf" {
    const content: string;
    export default content;
}

declare module "*.raw.cpp" {
    const content: string;
    export default content;
}

declare module "bdf-canvas" {
    export class BDFFont {
        constructor(font: string);

        drawChar(ctx: CanvasRenderingContext2D, c: number, bx: number, by: number, t?: any): any;

        drawEdgeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, t?: any): any;

        drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, t?: any): any;

        getGlyphOf(c: number): any;

        init(bdf: any): void;

        measureText(text: string): any;

        parse(bdf: any): void;

    }
}