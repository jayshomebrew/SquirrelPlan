/**
 * SquirrelPlan – Sankey Financial Flow Chart (v2)
 *
 * Renders a custom SVG Sankey diagram into #sankey-chart.
 * Called from script.js after every simulation run via window.renderSankeyChart(inputs).
 *
 * Flow diagram layout:
 *
 *  [Income Sources]  →  [Net Income]  →  [Savings]
 *  [SS/Pension]      ↗               ↘  [Total Expenses]  →  [Expense Items]
 *                                                           →  [Liability Items]
 *
 *  [Asset Portfolio] — shown as a separate infobox column (values, not flow)
 */

(function () {
    'use strict';

    /* ──────────────────────────────────────────────────────────────────
       Colour palettes
    ────────────────────────────────────────────────────────────────── */
    const C = {
        income:    ['#20c997','#17a589','#0e8e78','#0b7a67','#086655','#064f42'],
        pension:   ['#f39c12','#e67e22','#d35400','#ca6f1e','#b7950b'],
        asset:     ['#5470c6','#73c0de','#3ba272','#9a60b4','#fc8452','#ea7ccc'],
        expense:   ['#ee6666','#e55353','#dc3545','#c82333','#b21f2d','#9c1221'],
        liability: ['#fd7e14','#e8690d','#c85c0b','#a84d09','#8a3e07'],
        savings:   '#2ecc71',
        netIncome: '#20c997',
    };

    /* ──────────────────────────────────────────────────────────────────
       Helpers
    ────────────────────────────────────────────────────────────────── */
    const NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
        return e;
    }

    function hexToRgba(hex, a) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${a})` : `rgba(128,128,128,${a})`;
    }

    function fmt(v, lang) {
        return Math.round(v).toLocaleString(lang || 'en', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function clamp(str, n) {
        return str.length > n ? str.slice(0, n - 1) + '…' : str;
    }

    /* ──────────────────────────────────────────────────────────────────
       Public entry point
    ────────────────────────────────────────────────────────────────── */
    window.renderSankeyChart = function (inputs, targetYear = null) {
        const svg = document.getElementById('sankey-chart');
        if (!svg) return;

        const isDark      = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const lang        = (window.getSettings && window.getSettings().language) || 'en';
        const startYear   = new Date().getFullYear();
        const selectedYear= targetYear ? parseInt(targetYear) : startYear;
        const baseAge     = inputs.currentAge || 0;
        const selectedAge = baseAge + (selectedYear - startYear);
        const legalAge    = inputs.pensionAge  || 67;

        /* ── is a pension active for selected year/age? ── */
        function pensionActive(p) {
            const sy = p.startYear || 0;
            if (sy === 0)          return selectedAge >= legalAge;
            if (sy <= 100)         return selectedAge >= sy;          // age-based
            return selectedYear >= sy;                                // year-based
        }

        /* ── normalise to annual ── */
        function annual(item) {
            return (item.frequency === 'monthly' ? (item.value || 0) * 12 : (item.value || 0));
        }

        /* ── filter active items ── */
        function activeNow(item) {
            const sy = item.startYear || 0;
            const ey = item.endYear   || 0;
            const started = sy === 0 || (sy <= 100 ? selectedAge >= sy : selectedYear >= sy);
            const ended   = ey === 0 || (ey <= 100 ? selectedAge <= ey : selectedYear <= ey);
            return started && ended;
        }

        /* Collect data */
        const incomeItems = (inputs.incomes || []).filter(activeNow)
            .map((i, idx) => ({ label: i.name || `Income ${idx+1}`, value: annual(i), color: C.income[idx % C.income.length] }))
            .filter(n => n.value > 0);

        const pensionItems = (inputs.pensions || []).filter(pensionActive)
            .map((p, idx) => ({ label: p.name || `Pension ${idx+1}`, value: annual(p), color: C.pension[idx % C.pension.length] }))
            .filter(n => n.value > 0);

        const assetItems = (inputs.assets || [])
            .map((a, idx) => ({ label: a.name || `Asset ${idx+1}`, value: a.value || 0, color: C.asset[idx % C.asset.length] }))
            .filter(n => n.value > 0);

        const expenseItems = (inputs.expenses || []).filter(activeNow)
            .map((e, idx) => ({ label: e.name || `Expense ${idx+1}`, value: annual(e), color: C.expense[idx % C.expense.length] }))
            .filter(n => n.value > 0);

        const liabilityItems = (inputs.liabilities || [])
            .map((l, idx) => ({ label: l.name || `Liability ${idx+1}`, value: l.value || 0, color: C.liability[idx % C.liability.length] }))
            .filter(n => n.value > 0);

        /* Totals */
        const totalIncome   = incomeItems.reduce((s, x) => s + x.value, 0);
        const totalPension  = pensionItems.reduce((s, x) => s + x.value, 0);
        const totalExpenses = expenseItems.reduce((s, x) => s + x.value, 0);
        const netIncome     = totalIncome + totalPension;
        const savings       = Math.max(0, netIncome - totalExpenses);

        /* Nothing meaningful to draw */
        const hasAnything = netIncome > 0 || totalExpenses > 0 || assetItems.length > 0 || liabilityItems.length > 0;
        if (!hasAnything) {
            svg.innerHTML = `<text x="50%" y="50%" text-anchor="middle" fill="${isDark ? '#adb5bd' : '#6c757d'}" font-family="Inter,sans-serif" font-size="14">Enter financial data to see your summary flow.</text>`;
            svg.setAttribute('height', '120');
            return;
        }

        /* ── Layout ── */
        const containerW = Math.max(svg.parentElement.clientWidth || 900, 680);
        const W = containerW;

        /* We use 4 main columns for the Sankey flow:
           Col A: income/pension sources  (left edge of each node rect)
           Col B: Net Income node
           Col C: Savings + ExpTotal nodes
           Col D: individual expense & liability items
           Assets shown separately as a styled legend/table on the right of col D
        */
        const MARGIN_L  = 130;  // room for left-side labels
        const MARGIN_R  = 200;  // room for assets panel + right labels
        const FLOW_W    = W - MARGIN_L - MARGIN_R;
        const COL_COUNT = 4;
        const COL_W     = FLOW_W / COL_COUNT;
        const NODE_W    = 20;
        const NODE_R    = 5;
        const NODE_GAP  = 10;
        const PAD_TOP   = 50;
        const PAD_BOT   = 40;

        /* Column center-x values for the node rects */
        const colCX = [
            MARGIN_L + COL_W * 0.5,  // A: sources
            MARGIN_L + COL_W * 1.5,  // B: net income
            MARGIN_L + COL_W * 2.5,  // C: savings / exp total
            MARGIN_L + COL_W * 3.5,  // D: individual expenses
        ];

        /* Grand scale reference */
        const grandRef = Math.max(netIncome, totalExpenses + savings, 1);

        function barH(v) { return Math.max(16, Math.round((v / grandRef) * 480)); }

        /* Layout a column of nodes vertically centred at centerY */
        function layoutCol(items, centerY) {
            if (!items.length) return [];
            const totalH = items.reduce((s, it) => s + barH(it.value), 0) + NODE_GAP * (items.length - 1);
            let y = centerY - totalH / 2 + PAD_TOP;
            return items.map(it => {
                const h = barH(it.value);
                const node = { ...it, y, h };
                y += h + NODE_GAP;
                return node;
            });
        }

        /* Center reference */
        const leftItems  = [...incomeItems, ...pensionItems];
        const rightItems = [...expenseItems, ...liabilityItems];
        const leftTotalH = leftItems.reduce((s, x) => s + barH(x.value), 0) + NODE_GAP * Math.max(0, leftItems.length - 1);
        const midY = Math.max(leftTotalH / 2, 240);

        const laidLeft = layoutCol(leftItems, midY);
        const niH = barH(netIncome || 1);
        const niY = midY - niH / 2 + PAD_TOP;
        const laidNI = [{ label: 'Net Income', value: netIncome, color: C.netIncome, y: niY, h: niH }];

        const savH  = savings > 0 ? barH(savings) : 0;
        const expTH = totalExpenses > 0 ? barH(totalExpenses) : 0;
        const col2Total = savH + expTH + (savH > 0 && expTH > 0 ? NODE_GAP : 0);
        const col2Start = midY - col2Total / 2 + PAD_TOP;
        const laidCol2 = [];
        if (savings > 0) laidCol2.push({ label: 'Annual Savings', value: savings, color: C.savings, y: col2Start, h: savH, kind: 'savings' });
        if (totalExpenses > 0) laidCol2.push({ label: 'Total Expenses', value: totalExpenses, color: C.expense[0], y: col2Start + savH + (savH > 0 ? NODE_GAP : 0), h: expTH, kind: 'expense' });

        const laidRight = layoutCol(rightItems, midY);

        /* Calculate total SVG height */
        function maxBottom(nodes) { return nodes.length ? nodes[nodes.length-1].y + nodes[nodes.length-1].h : 0; }
        const svgH = Math.max(maxBottom(laidLeft), maxBottom(laidNI), maxBottom(laidCol2), maxBottom(laidRight), 380) + PAD_BOT;

        /* ── Start building SVG ── */
        svg.innerHTML = '';
        svg.setAttribute('height', svgH);
        svg.setAttribute('viewBox', `0 0 ${W} ${svgH}`);
        svg.setAttribute('width', '100%');

        const textCol  = isDark ? '#dee2e6' : '#212529';
        const mutedCol = isDark ? '#9e9e9e' : '#6c757d';
        const LINK_A   = 0.30;

        /* ── Defs: gradients + shadow ── */
        const defs = svgEl('defs', {});

        const filt = svgEl('filter', { id: 'sp-shadow', x: '-20%', y: '-20%', width: '140%', height: '140%' });
        filt.appendChild(svgEl('feDropShadow', { dx: '0', dy: '1', stdDeviation: '2.5', 'flood-color': 'rgba(0,0,0,0.18)' }));
        defs.appendChild(filt);
        svg.appendChild(defs);

        /* layer groups */
        const gLinks  = svgEl('g', { class: 'sp-links' });
        const gNodes  = svgEl('g', { class: 'sp-nodes' });
        const gLabels = svgEl('g', { class: 'sp-labels' });
        const gHdrs   = svgEl('g', { class: 'sp-headers' });

        /* ── Draw helpers ── */

        /* Gradient rect */
        function drawNode(parent, node, cx) {
            const gId = `ng-${Math.random().toString(36).slice(2,8)}`;
            const grad = svgEl('linearGradient', { id: gId, x1:'0', y1:'0', x2:'0', y2:'1' });
            const s1 = svgEl('stop', { offset:'0%',   'stop-color': node.color, 'stop-opacity':'0.95' });
            const s2 = svgEl('stop', { offset:'100%', 'stop-color': node.color, 'stop-opacity':'0.65' });
            grad.appendChild(s1); grad.appendChild(s2);
            defs.appendChild(grad);

            const rect = svgEl('rect', {
                x: cx - NODE_W / 2, y: node.y,
                width: NODE_W, height: node.h, rx: NODE_R,
                fill: `url(#${gId})`,
                stroke: node.color, 'stroke-width': '1.5',
                filter: 'url(#sp-shadow)',
            });
            parent.appendChild(rect);
        }

        /* Text label pair */
        function drawLabel(parent, node, tx, anchor) {
            const cy = node.y + node.h / 2;
            const name = svgEl('text', {
                x: tx, y: cy - 7, 'text-anchor': anchor,
                'font-size': '11.5', 'font-weight': '600',
                'font-family': 'Inter,sans-serif', fill: textCol,
            });
            name.textContent = clamp(node.label, 20);
            parent.appendChild(name);

            const val = svgEl('text', {
                x: tx, y: cy + 8, 'text-anchor': anchor,
                'font-size': '10.5', 'font-family': 'Inter,sans-serif', fill: mutedCol,
            });
            val.textContent = '$' + fmt(node.value, lang);
            parent.appendChild(val);
        }

        /* Cubic bezier band */
        function drawLink(parent, x0, y0, h0, x1, y1, h1, color) {
            const mx = (x0 + x1) / 2;
            const d = `M${x0} ${y0} C${mx} ${y0},${mx} ${y1},${x1} ${y1} L${x1} ${y1+h1} C${mx} ${y1+h1},${mx} ${y0+h0},${x0} ${y0+h0} Z`;
            const path = svgEl('path', {
                d,
                fill: hexToRgba(color, LINK_A),
                stroke: hexToRgba(color, LINK_A + 0.15),
                'stroke-width': '0.5',
                class: 'sankey-link',
            });
            parent.appendChild(path);
        }

        /* Column header text */
        function hdr(x, text) {
            const t = svgEl('text', {
                x, y: 28, 'text-anchor': 'middle',
                'font-size': '10', 'font-weight': '700', 'letter-spacing': '0.6',
                'font-family': 'Inter,sans-serif', fill: mutedCol,
                'text-transform': 'uppercase',
            });
            t.textContent = text.toUpperCase();
            gHdrs.appendChild(t);
        }

        /* ── LINKS ── */

        /* Left sources → Net Income */
        {
            const x0 = colCX[0] + NODE_W / 2;
            const x1 = colCX[1] - NODE_W / 2;
            let dstOff = 0;
            for (const src of laidLeft) {
                const lh = barH(src.value);
                drawLink(gLinks, x0, src.y, lh, x1, laidNI[0].y + dstOff, lh, src.color);
                dstOff += lh;
            }
        }

        /* Net Income → Savings */
        if (laidCol2.find(n => n.kind === 'savings')) {
            const sNode = laidCol2.find(n => n.kind === 'savings');
            const lh = barH(savings);
            drawLink(gLinks, colCX[1] + NODE_W/2, laidNI[0].y, lh, colCX[2] - NODE_W/2, sNode.y, lh, C.savings);
        }

        /* Net Income → Expenses Total */
        if (laidCol2.find(n => n.kind === 'expense')) {
            const eNode = laidCol2.find(n => n.kind === 'expense');
            const lh = barH(totalExpenses);
            const srcOffY = savings > 0 ? barH(savings) : 0;
            drawLink(gLinks, colCX[1] + NODE_W/2, laidNI[0].y + srcOffY, lh, colCX[2] - NODE_W/2, eNode.y, lh, C.expense[0]);
        }

        /* Expenses Total → individual items */
        {
            const eColNode = laidCol2.find(n => n.kind === 'expense');
            if (eColNode) {
                let srcOff = 0;
                for (const dst of laidRight) {
                    const lh = barH(dst.value);
                    drawLink(gLinks, colCX[2] + NODE_W/2, eColNode.y + srcOff, lh, colCX[3] - NODE_W/2, dst.y, lh, dst.color);
                    srcOff += lh;
                }
            }
        }

        svg.appendChild(gLinks);

        /* ── NODES + LABELS ── */

        /* A: left sources */
        for (const n of laidLeft) {
            drawNode(gNodes, n, colCX[0]);
            drawLabel(gLabels, n, colCX[0] - NODE_W/2 - 6, 'end');
        }

        /* B: net income */
        for (const n of laidNI) {
            drawNode(gNodes, n, colCX[1]);
            drawLabel(gLabels, n, colCX[1], 'middle');
        }

        /* C: savings / expenses total */
        for (const n of laidCol2) {
            drawNode(gNodes, n, colCX[2]);
            if (n.kind === 'savings') drawLabel(gLabels, n, colCX[2] - NODE_W/2 - 6, 'end');
            else                      drawLabel(gLabels, n, colCX[2] + NODE_W/2 + 6, 'start');
        }

        /* D: right items */
        for (const n of laidRight) {
            drawNode(gNodes, n, colCX[3]);
            drawLabel(gLabels, n, colCX[3] + NODE_W/2 + 6, 'start');
        }

        svg.appendChild(gNodes);
        svg.appendChild(gLabels);

        /* ── ASSETS panel (right side) ── */
        if (assetItems.length > 0) {
            const panelX = W - MARGIN_R + 16;
            const totalAssets = assetItems.reduce((s, a) => s + a.value, 0);

            /* Header */
            const hdrT = svgEl('text', {
                x: panelX, y: 28, 'text-anchor': 'start',
                'font-size': '10', 'font-weight': '700', 'letter-spacing': '0.6',
                'font-family': 'Inter,sans-serif', fill: mutedCol,
            });
            hdrT.textContent = 'ASSET PORTFOLIO';
            gHdrs.appendChild(hdrT);

            let ay = PAD_TOP + 10;
            const dotR = 5;

            for (const a of assetItems) {
                const pct = totalAssets > 0 ? Math.round((a.value / totalAssets) * 100) : 0;
                // colour dot
                const dot = svgEl('circle', { cx: panelX + dotR, cy: ay + 8, r: String(dotR), fill: a.color });
                gLabels.appendChild(dot);

                const nt = svgEl('text', {
                    x: panelX + dotR*2 + 5, y: ay + 4,
                    'font-size': '11', 'font-weight': '600',
                    'font-family': 'Inter,sans-serif', fill: textCol,
                });
                nt.textContent = clamp(a.label, 18);
                gLabels.appendChild(nt);

                const vt = svgEl('text', {
                    x: panelX + dotR*2 + 5, y: ay + 17,
                    'font-size': '10.5',
                    'font-family': 'Inter,sans-serif', fill: mutedCol,
                });
                vt.textContent = `$${fmt(a.value, lang)}  (${pct}%)`;
                gLabels.appendChild(vt);

                ay += 32;
            }

            /* Divider + total */
            const divY = ay + 2;
            const div = svgEl('line', { x1: panelX, y1: divY, x2: W - 8, y2: divY, stroke: mutedCol, 'stroke-opacity': '0.4', 'stroke-width': '1' });
            gLabels.appendChild(div);

            const totT = svgEl('text', {
                x: panelX, y: divY + 14,
                'font-size': '11', 'font-weight': '700',
                'font-family': 'Inter,sans-serif', fill: textCol,
            });
            totT.textContent = `Total: $${fmt(totalAssets, lang)}`;
            gLabels.appendChild(totT);
        }

        /* ── Column headers ── */
        hdr(colCX[0], 'Income & Pension');
        hdr(colCX[1], 'Net Income');
        hdr(colCX[2], 'Savings / Outflows');
        hdr(colCX[3], 'Expenses & Liabilities');

        svg.appendChild(gHdrs);

        /* ── Tooltip on link hover ── */
        svg.querySelectorAll('.sankey-link').forEach(path => {
            path.addEventListener('mouseenter', () => path.style.opacity = '0.7');
            path.addEventListener('mouseleave', () => path.style.opacity = '1');
        });
    };

})();
