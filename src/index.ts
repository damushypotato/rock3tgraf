const createTable = (file: p5.File) => {
    const table = new p5.Table();

    const lines = (file.data as string).split('\r\n');
    lines.pop();

    table.addColumn(lines.shift());
    for (const line of lines) {
        table.addRow(new p5.TableRow(line));
    }

    return table;
};

let table: p5.Table;

const sketch = (p: p5) => {
    p.preload = () => {};

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        const fileInput = p.createFileInput((file: p5.File) => {
            table = createTable(file);

            drawGraph();
        });

        fileInput.position(0, 0);
    };

    function drawGraph() {
        p.background(255);

        if (!table) {
            console.log('No table');
        }

        let time = table.getColumn(0);

        time = time.map(t => (t - time[0]) / 1000000);

        // draw lines for each second
        p.stroke(200);
        p.strokeWeight(1);
        for (let i = 0; i < time[time.length - 1]; i++) {
            const x = p.map(i, 0, time[time.length - 1], 0, p.width);
            p.line(x, 0, x, p.height);
        }

        p.stroke(200);
        p.strokeWeight(1);
        for (let i = -10; i <= 200; i += 10) {
            const y = p.map(i, -10, 200, p.height, 0);
            p.line(0, y, p.width, y);
        }

        //draw x axis
        p.stroke(0);
        p.strokeWeight(2);
        p.line(0, p.map(0, -10, 200, p.height, 0), p.width, p.map(0, -10, 200, p.height, 0));

        // let values = table.getColumn(3);

        // values = values.map(v => -v);

        const ax = table.getColumn(1);
        const ay = table.getColumn(2);
        const az = table.getColumn(3);

        const values = [];

        for (let i = 0; i < ax.length; i++) {
            const a = Math.sqrt(ax[i] ** 2 + ay[i] ** 2 + az[i] ** 2);
            values.push(a);
        }

        const vmax = [Math.max(...values)];

        const vmin = [Math.min(...values)];

        p.beginShape();
        p.noFill();
        p.stroke('blue');
        p.strokeWeight(2);
        for (let i = 0; i < time.length; i++) {
            const v = values[i];
            const x = p.map(time[i], 0, time[time.length - 1], 0, p.width);
            const y = p.map(v, -10, 200, p.height, 0);

            p.push();

            p.textAlign(p.CENTER, p.TOP);

            if (v === vmax[0]) {
                p.noStroke();
                p.fill('red');
                p.strokeWeight(4);
                p.circle(x, y, 10);

                p.text(`(${v.toFixed(2)}ms^-2, ${time[i].toFixed(2)}s)`, x, y - 15);
            }

            if (v === vmin[0]) {
                p.noStroke();
                p.fill('green');
                p.strokeWeight(4);
                p.circle(x, y, 10);

                p.text(`(${v.toFixed(2)}ms^-2, ${time[i].toFixed(2)}s)`, x, y + 15);
            }

            p.vertex(x, y);

            p.pop();
        }
        p.endShape();

        console.log(time);

        return {
            time,
            values,
        };
    }
};

new p5(sketch);
