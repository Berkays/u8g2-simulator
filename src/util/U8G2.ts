import { Display } from "../displays/DisplayApi";
import courB12 from "bundle-text:../bdf/courB12.bdf";
import { BDFFont } from 'bdf-canvas';

export type CIRC_OPT =
    "U8G2_DRAW_UPPER_RIGHT" |
    "U8G2_DRAW_UPPER_LEFT" |
    "U8G2_DRAW_LOWER_LEFT" |
    "U8G2_DRAW_LOWER_RIGHT" |
    "U8G2_DRAW_ALL";

export interface FontMap {
    [key: string]: {
        bdfFont: { drawText(ctx: CanvasRenderingContext2D, str: string, x: number, y: number): void } | null
    };
}

export class U8G2 {
    private drawColor = 0;
    private font: string = "";
    private bdfFonts: FontMap = {};

    constructor(private ctx: CanvasRenderingContext2D, private display: Display) {
        this.ctx.lineWidth = 1;
        this.ctx.imageSmoothingEnabled = false;
    }

    getDisplay() {
        return this.display;
    }

    clear() {
        let t = this.drawColor;
        this.setDrawColor(this.display.resetColor);
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.display.width, this.display.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.setDrawColor(t);
    }

    drawBox(x0: number, y0: number, w: number, h: number) {
        for (let y = y0; y < y0 + h; y++) {
            this.drawHLine(x0, y, w);
        }
    }

    private _drawCircleSection(x: number, y: number, x0: number, y0: number, option: CIRC_OPT) {
        if (option === "U8G2_DRAW_UPPER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 + x, y0 - y);
            this.drawPixel(x0 + y, y0 - x);
        }

        if (option === "U8G2_DRAW_UPPER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 - x, y0 - y);
            this.drawPixel(x0 - y, y0 - x);
        }

        if (option === "U8G2_DRAW_LOWER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 + x, y0 + y);
            this.drawPixel(x0 + y, y0 + x);
        }

        if (option === "U8G2_DRAW_LOWER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 - x, y0 + y);
            this.drawPixel(x0 - y, y0 + x);
        }

    }

    drawCircle(x0: number, y0: number, rad: number, option: CIRC_OPT = "U8G2_DRAW_ALL") {
        let f;
        let ddFx;
        let ddFy;
        let x;
        let y;

        f = 1;
        f -= rad;
        ddFx = 1;
        ddFy = 0;
        ddFy -= rad;
        ddFy *= 2;
        x = 0;
        y = rad;

        this._drawCircleSection(x, y, x0, y0, option);

        while (x < y) {
            if (f >= 0) {
                y--;
                ddFy += 2;
                f += ddFy;
            }
            x++;
            ddFx += 2;
            f += ddFx;

            this._drawCircleSection(x, y, x0, y0, option);
        }
    }

    _drawDiscSection(x: number, y: number, x0: number, y0: number, option: CIRC_OPT) {
        if (option === "U8G2_DRAW_UPPER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 + x, y0 - y, y + 1);
            this.drawVLine(x0 + y, y0 - x, x + 1);
        }

        if (option === "U8G2_DRAW_UPPER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 - x, y0 - y, y + 1);
            this.drawVLine(x0 - y, y0 - x, x + 1);
        }

        if (option === "U8G2_DRAW_LOWER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 + x, y0, y + 1);
            this.drawVLine(x0 + y, y0, x + 1);
        }

        if (option === "U8G2_DRAW_LOWER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 - x, y0, y + 1);
            this.drawVLine(x0 - y, y0, x + 1);
        }

    }

    drawDisc(x0: number, y0: number, rad: number, option: CIRC_OPT = "U8G2_DRAW_ALL") {
        let f;
        let ddFx;
        let ddFy;
        let x;
        let y;

        f = 1;
        f -= rad;
        ddFx = 1;
        ddFy = 0;
        ddFy -= rad;
        ddFy *= 2;
        x = 0;
        y = rad;

        this._drawDiscSection(x, y, x0, y0, option);

        while (x < y) {
            if (f >= 0) {
                y--;
                ddFy += 2;
                f += ddFy;
            }
            x++;
            ddFx += 2;
            f += ddFx;

            this._drawDiscSection(x, y, x0, y0, option);
        }
    }

    _drawEllipseSection(x: number, y: number, x0: number, y0: number, option: CIRC_OPT = "U8G2_DRAW_ALL") {
        /* upper right */
        if (option === "U8G2_DRAW_UPPER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 + x, y0 - y);
        }

        /* upper left */
        if (option === "U8G2_DRAW_UPPER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 - x, y0 - y);
        }

        /* lower right */
        if (option === "U8G2_DRAW_LOWER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 + x, y0 + y);
        }

        /* lower left */
        if (option === "U8G2_DRAW_LOWER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawPixel(x0 - x, y0 + y);
        }
    }

    drawEllipse(x0: number, y0: number, rx: number, ry: number, option: CIRC_OPT = "U8G2_DRAW_ALL", fill: boolean = false) {
        let x;
        let y;
        let xchg;
        let ychg;
        let err;
        let rxrx2;
        let ryry2;
        let stopx;
        let stopy;

        rxrx2 = rx;
        rxrx2 *= rx;
        rxrx2 *= 2;

        ryry2 = ry;
        ryry2 *= ry;
        ryry2 *= 2;

        x = rx;
        y = 0;

        xchg = 1;
        xchg -= rx;
        xchg -= rx;
        xchg *= ry;
        xchg *= ry;

        ychg = rx;
        ychg *= rx;

        err = 0;

        stopx = ryry2;
        stopx *= rx;
        stopy = 0;

        while (stopx >= stopy) {
            this._drawEllipseSection(x, y, x0, y0, option);
            y++;
            stopy += rxrx2;
            err += ychg;
            ychg += rxrx2;
            if (2 * err + xchg > 0) {
                x--;
                stopx -= ryry2;
                err += xchg;
                xchg += ryry2;
            }
        }

        x = 0;
        y = ry;

        xchg = ry;
        xchg *= ry;

        ychg = 1;
        ychg -= ry;
        ychg -= ry;
        ychg *= rx;
        ychg *= rx;

        err = 0;

        stopx = 0;

        stopy = rxrx2;
        stopy *= ry;

        while (stopx <= stopy) {
            this._drawEllipseSection(x, y, x0, y0, option);
            x++;
            stopx += ryry2;
            err += xchg;
            xchg += ryry2;
            if (2 * err + ychg > 0) {
                y--;
                stopy -= rxrx2;
                err += ychg;
                ychg += rxrx2;
            }
        }
    }

    _drawFilledEllipseSection(x: number, y: number, x0: number, y0: number, option: CIRC_OPT = "U8G2_DRAW_ALL") {
        /* upper right */
        if (option === "U8G2_DRAW_UPPER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 + x, y0 - y, y + 1);
        }

        /* upper left */
        if (option === "U8G2_DRAW_UPPER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 - x, y0 - y, y + 1);
        }

        /* lower right */
        if (option === "U8G2_DRAW_LOWER_RIGHT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 + x, y0, y + 1);
        }

        /* lower left */
        if (option === "U8G2_DRAW_LOWER_LEFT" || option === "U8G2_DRAW_ALL") {
            this.drawVLine(x0 - x, y0, y + 1);
        }
    }

    drawFilledEllipse(x0: number, y0: number, rx: number, ry: number, option: CIRC_OPT = "U8G2_DRAW_ALL") {
        let x;
        let y;
        let xchg;
        let ychg;
        let err;
        let rxrx2;
        let ryry2;
        let stopx;
        let stopy;

        rxrx2 = rx;
        rxrx2 *= rx;
        rxrx2 *= 2;

        ryry2 = ry;
        ryry2 *= ry;
        ryry2 *= 2;

        x = rx;
        y = 0;

        xchg = 1;
        xchg -= rx;
        xchg -= rx;
        xchg *= ry;
        xchg *= ry;

        ychg = rx;
        ychg *= rx;

        err = 0;

        stopx = ryry2;
        stopx *= rx;
        stopy = 0;

        while (stopx >= stopy) {
            this._drawFilledEllipseSection(x, y, x0, y0, option);
            y++;
            stopy += rxrx2;
            err += ychg;
            ychg += rxrx2;
            if (2 * err + xchg > 0) {
                x--;
                stopx -= ryry2;
                err += xchg;
                xchg += ryry2;
            }
        }

        x = 0;
        y = ry;

        xchg = ry;
        xchg *= ry;

        ychg = 1;
        ychg -= ry;
        ychg -= ry;
        ychg *= rx;
        ychg *= rx;

        err = 0;

        stopx = 0;

        stopy = rxrx2;
        stopy *= ry;

        while (stopx <= stopy) {
            this._drawFilledEllipseSection(x, y, x0, y0, option);
            x++;
            stopx += ryry2;
            err += xchg;
            xchg += ryry2;
            if (2 * err + ychg > 0) {
                y--;
                stopy -= rxrx2;
                err += ychg;
                ychg += rxrx2;
            }
        }
    }

    drawFrame(x: number, y: number, w: number, h: number) {
        this.drawHLine(x, y, w);
        this.drawHLine(x, y + h, w);

        this.drawVLine(x, y, h);
        this.drawVLine(x + w, y, h);
    }

    drawHLine(x: number, y: number, w: number) {
        for (let i = 0; i < w; i++) {
            this.drawPixel(x + i, y);
        }
    }

    drawVLine(x: number, y: number, h: number) {
        for (let i = 0; i < h; i++) {
            this.drawPixel(x, y + i);
        }
    }

    drawLine(x0: number, y0: number, x1: number, y1: number) {
        // first draw the start/stop
        this.drawPixel(x0, y0);
        this.drawPixel(x1, y1);

        // catch the pixel
        if (x0 === x1 && y0 === y1) {
            // we are done here
            return;
        }

        // catch the VLine
        if (x0 === x1) {
            if (y0 < y1) {
                this.drawVLine(x0, y0, y1 - y0);
            } else {
                this.drawVLine(x1, y1, y0 - y1);
            }
            return;
        }

        // catch the HLine
        if (y0 === y1) {
            if (x0 < x1) {
                this.drawHLine(x0, y0, x1 - x0);
            } else {
                this.drawHLine(x1, y1, x0 - x1);
            }
            return;
        }

        const w = Math.abs(x1 - x0);
        const h = Math.abs(y1 - y0);
        // let s = Math.floor(w / Math.abs(y1 - y0));
        // s = s === 0 ? 1 : s;

        if (h > w) {
            const s = w / Math.abs(y1 - y0);
            // line is higher than wide:
            if (x0 < x1) {
                let y = 0;
                for (let x = 0; x < w; x += s) {
                    this.drawHLine(x0 + x, y0 + y, s);
                    if (y0 < y1) {
                        y++;
                    } else {
                        y--;
                    }
                }
            }
            if (x0 > x1) {
                let y = 0;
                for (let x = 0; x < w; x += s) {
                    this.drawHLine(x1 + x, y1 + y, s);
                    if (y0 > y1) {
                        y++;
                    } else {
                        y--;
                    }
                }
            }
        } else {
            const s = h / Math.abs(x1 - x0);
            // line is wider than high:
            if (y0 < y1) {
                let x = 0;
                for (let y = 0; y < h; y += s) {
                    this.drawVLine(x0 + x, y0 + y, s);
                    if (x0 < x1) {
                        x++;
                    } else {
                        x--;
                    }
                }
            }
            if (y0 > y1) {
                let x = 0;
                for (let y = 0; y < h; y += s) {
                    this.drawVLine(x1 + x, y1 + y, s);
                    if (x0 > x1) {
                        x++;
                    } else {
                        x--;
                    }
                }
            }
        }
    }

    drawPixel(x: number, y: number) {
        const id = this.ctx.createImageData(1, 1);
        const d = id.data;
        const hexColor = this.display.colorMap[this.drawColor];
        d[0] = parseInt(hexColor.slice(1, 1 + 2), 16);
        d[1] = parseInt(hexColor.slice(3, 3 + 2), 16);
        d[2] = parseInt(hexColor.slice(5, 5 + 2), 16);
        d[3] = 255;

        this.ctx.putImageData(id, x, y);
    }

    drawRFrame(x: number, y: number, w: number, h: number, r: number) {

        let xl;
        let yu;

        xl = x;
        xl += r;
        yu = y;
        yu += r;

        {
            let yl;
            let xr;

            xr = x;
            xr += w;
            xr -= r;
            xr -= 1;

            yl = y;
            yl += h;
            yl -= r;
            yl -= 1;

            this.drawCircle(xl, yu, r, "U8G2_DRAW_UPPER_LEFT");
            this.drawCircle(xr, yu, r, "U8G2_DRAW_UPPER_RIGHT");
            this.drawCircle(xl, yl, r, "U8G2_DRAW_LOWER_LEFT");
            this.drawCircle(xr, yl, r, "U8G2_DRAW_LOWER_RIGHT");
        }

        {
            let ww;
            let hh;

            ww = w;
            ww -= r;
            ww -= r;
            hh = h;
            hh -= r;
            hh -= r;

            xl++;
            yu++;

            if (ww >= 3) {
                ww -= 2;
                h--;
                this.drawHLine(xl, y, ww);
                this.drawHLine(xl, y + h, ww);
            }

            if (hh >= 3) {
                hh -= 2;
                w--;
                this.drawVLine(x, yu, hh);
                this.drawVLine(x + w, yu, hh);
            }
        }
    }

    drawRBox(x: number, y: number, w: number, h: number, r: number) {

        let xl;
        let yu;
        let yl;
        let xr;

        xl = x;
        xl += r;
        yu = y;
        yu += r;

        xr = x;
        xr += w;
        xr -= r;
        xr -= 1;

        yl = y;
        yl += h;
        yl -= r;
        yl -= 1;

        this.drawDisc(xl, yu, r, "U8G2_DRAW_UPPER_LEFT");
        this.drawDisc(xr, yu, r, "U8G2_DRAW_UPPER_RIGHT");
        this.drawDisc(xl, yl, r, "U8G2_DRAW_LOWER_LEFT");
        this.drawDisc(xr, yl, r, "U8G2_DRAW_LOWER_RIGHT");

        {
            let ww;
            let hh;

            ww = w;
            ww -= r;
            ww -= r;
            xl++;
            yu++;

            if (ww >= 3) {
                ww -= 2;
                this.drawBox(xl, y, ww, r + 1);
                this.drawBox(xl, yl, ww, r + 1);
            }

            hh = h;
            hh -= r;
            hh -= r;
            // h--;
            if (hh >= 3) {
                hh -= 2;
                this.drawBox(x, yu, w, hh);
            }
        }
    }

    drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x0, y0);
        this.ctx.closePath();
        this.ctx.fill();

        // try to destroy antialiasing by browser
        this.drawLine(x0, y0, x1, y1);
        this.drawLine(x1, y1, x2, y2);
        this.drawLine(x2, y2, x0, y0);
    }

    setFont(font: string) {
        this.font = font;
    }

    private _loadFont() {
        const fontName = this.font.slice("u8g2_font_".length);
        const bdfFont = this.bdfFonts[fontName] && this.bdfFonts[fontName].bdfFont;

        if (bdfFont) {
            return bdfFont as BDFFont;
        } else {
            const fetchFont = (fName: string) => {
                fetch("./bdf/" + fName + ".bdf")
                    .then(resp => resp.text())
                    .then(text => {
                        this.bdfFonts[fName] = { bdfFont: new BDFFont(text) };
                        console.log("got font" + fName, this.bdfFonts[fName]);
                    })
                    .catch(e => console.log(e));
            };
            // fetch font from server
            this.bdfFonts[fontName] = { bdfFont: null };
            fetchFont(fontName);

            // return dummy until loaded
            return new BDFFont(courB12);
        }
    }

    drawStr(x: number, y: number, str: string) {
        const bdfFont = this._loadFont();
        bdfFont.drawText(this.ctx, str, x, y - 1);
    }

    drawGlyph(x: number, y: number, encoding: number) {
        const bdfFont = this._loadFont();
        if (bdfFont.getGlyphOf(encoding)) {
            bdfFont.drawChar(this.ctx, encoding, x, y - 1);
        }
    }

    setDrawColor(color: number) {
        this.ctx.fillStyle = this.display.colorMap[color];
        this.ctx.strokeStyle = this.display.colorMap[color];
        this.drawColor = color;
    }

    getDisplayHeight() {
        return this.display.height;
    }

    getDisplayWidth() {
        return this.display.width;
    }

    getStrWidth(txt: string) {
        return this.ctx.measureText(txt);
    }

    drawBitmap(x0: number, y0: number, cnt: number, h: number, bitmap: number[]) {
        // cnt: Number of bytes of the bitmap in horizontal direction. The width of the bitmap is cnt*8.
        // h: Height of the bitmap.

        for (let x = 0; x < cnt; x++) {
            for (let y = 0; y < h; y++) {

                const bytes = (bitmap[x + y * cnt] + 256).toString(2);
                for (let b = 0; b < 8; b++) {
                    if (bytes[b + 1] === "1") {
                        this.drawPixel(x * 8 + x0 + b, y + y0);
                    }
                }
            }
        }
    }

    drawXBM(x0: number, y0: number, w: number, h: number, bitmap: number[]) {
        // first find out the real width of the xbm
        const fixedW = w % 8 === 0 ? w : (Math.floor(w / 8) + 1) * 8;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < fixedW; x++) {
                if (x >= w) {
                    break;
                }
                // get next byte
                const byteIndex = Math.floor((x + y * fixedW) / 8);
                const byte = bitmap[byteIndex];
                const bits = (byte + 256).toString(2);

                if (bits[8 - (x + y * fixedW) % 8] === "1") {
                    this.drawPixel(x + x0, y + y0);
                }
            }
        }
    }

    getMaxCharWidth() {
        const fontName = this.font.slice("u8g2_font_".length);
        const bdfFont = this.bdfFonts[fontName] && this.bdfFonts[fontName].bdfFont;

        if (bdfFont) {
            let bf = (bdfFont as any);

            if (!bf.getMaxCharWidth) {
                let max = 0;
                Object.keys(bf.glyphs).forEach(key => {
                    let g = bf.glyphs[key];

                    if (g.DWIDTH.x > max) {
                        max = g.DWIDTH.x;
                    }
                });
                bf.getMaxCharWidth = max;
            }

            return bf.getMaxCharWidth;
        }
    }

    getMaxCharHeight() {
        const fontName = this.font.slice("u8g2_font_".length);
        const bdfFont = this.bdfFonts[fontName] && this.bdfFonts[fontName].bdfFont;

        if (bdfFont) {
            let bf = (bdfFont as any);

            return bf.SIZE.size;
        }
    }
}
