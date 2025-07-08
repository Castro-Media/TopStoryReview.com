function ArrTabler(arr){
    // Create a table element
    var table = document.createElement('table');
    //Get a list of column names from the first object
    var columns = Object.keys(arr[0]);
    // Create thead element
    var thead = document.createElement('thead');
    // Create a row for the header
    var headerRow = document.createElement('tr');
    // Create and append th elements for each column
    //The first one should have width=1
    first = true;
    columns.forEach(function(column) {
        var th = document.createElement('th');
        if(first){
            //set attribute width to 1
            th.setAttribute('width', '1');
            first = false;
        }
        th.textContent = column;
        headerRow.appendChild(th);
    });
    // Append the header row to thead
    thead.appendChild(headerRow);
    // Append thead to the table
    table.appendChild(thead);


    // Create tbody element
    var tbody = document.createElement('tbody');
    // Iterate over each object in the array
    arr.forEach(function(item) {
        // Create a row for each object
        var row = document.createElement('tr');
        // Create and append td elements for each property in the object
        columns.forEach(function(column) {
            var td = document.createElement('td');
            td.textContent = item[column];
            row.appendChild(td);
        });
        // Append the row to tbody
        tbody.appendChild(row);
    });
    // Append tbody to the table
    table.appendChild(tbody);

    // create tfoot element
    var tfoot = document.createElement('tfoot');
    // Create a row for the footer
    var footerRow = document.createElement('tr');
    // Create and append th elements for each column
    columns.forEach(function(column) {
        var th = document.createElement('th');
        th.textContent = column;
        footerRow.appendChild(th);
    });
    // Append the footer row to tfoot
    tfoot.appendChild(footerRow);
    // Append tfoot to the table
    table.appendChild(tfoot);

    // Set the class for the table
    table.className = 'tablesorter tablesorter-ice';

    return table;
}

function parseCsvLine(line){
    var result = [];
    var current = '';
    var inQuotes = false;
    for(var i=0;i<line.length;i++){
        var c = line[i];
        if(c === '"'){
            if(inQuotes && line[i+1] === '"'){
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if(c === ',' && !inQuotes){
            result.push(current);
            current = '';
        } else {
            current += c;
        }
    }
    result.push(current);
    return result;
}

function csvToObjects(text){
    var lines = text.trim().split(/\r?\n/);
    if(lines.length < 2){
        return [];
    }
    var headers = parseCsvLine(lines[0]);
    var rows = [];
    for(var i=1;i<lines.length;i++){
        if(!lines[i]){ continue; }
        var values = parseCsvLine(lines[i]);
        var obj = {};
        headers.forEach(function(h, idx){ obj[h] = values[idx]; });
        rows.push(obj);
    }
    return rows;
}

function parseHeadlineDate(str){
    // convert "YYYY-MM-DD-HH-MM-SS +0000" to Date
    if(!str){ return new Date(NaN); }
    var parts = str.split(' ');
    var dt = parts[0].split('-');
    if(dt.length < 6){ return new Date(NaN); }
    var iso = dt[0] + '-' + dt[1] + '-' + dt[2] + 'T' + dt[3] + ':' + dt[4] + ':' + dt[5] + 'Z';
    return new Date(iso);
}

function HeadlinesLister($container){
    fetch('./latest.csv')
        .then(function(r){ return r.text(); })
        .then(function(text){
            var rows = csvToObjects(text);
            rows.sort(function(a,b){
                return parseHeadlineDate(b.pubdate) - parseHeadlineDate(a.pubdate);
            });
            var ul = $('<ul></ul>');
            rows.forEach(function(row){
                var li = $('<li></li>');
                var link = $('<a></a>').attr('href', row.link).text(row.title);
                li.append(link);
                li.append('<br>');
                li.append($('<small></small>').text(row.source + ' - ' + row.pubdate));
                ul.append(li);
            });
            $container.empty().append(ul);
        })
        .catch(function(){
            $container.text('Unable to load headlines.');
        });
}

function SourceTabler($container){
    fetch('./latest.json')
        .then(r => r.json())
        .then(d => {
            if (d.observations){
                var arr = d.observations.map(o => ({ date: o.date, value: o.value }));
                var table = ArrTabler(arr);
                $container.html(table);
                //$(table).tablesorter();
                table = new DataTable('#data-table table', {
                    order: [[0, 'desc']],
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'dt-head-left dt-body-left'
                        }
                    ]
                });
            } else {
                $container.text("This source isn't supported for tables yet.");
            }
        })
        .catch(() => {
            $container.text("This source isn't supported for tables yet.");
        });
}

function createLineChart(labels, datasets, $container){
    $container.empty();
    var canvas = document.createElement('canvas');
    $container.append(canvas);
    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });
}

function isNumeric(val){
    if(typeof val === 'number'){
        return !isNaN(val);
    }
    if(typeof val !== 'string'){
        return false;
    }
    return /^-?\d+(\.\d+)?$/.test(val.trim());
}

function parseTable(arr){
    if(!Array.isArray(arr) || arr.length === 0){
        return null;
    }
    var row = arr[0];
    var keys = Object.keys(row);
    if(keys.length < 2){
        console.log("Chart unsupported: observations need at least two fields for labels and values.");
        return null;
    }
    var firstKey = keys[0];
    if(isNumeric(row[firstKey])){
        console.log("Chart unsupported: first field '" + firstKey + "' must be non-numeric.");
        return null;
    }
    for(var i=1;i<keys.length;i++){
        if(!isNumeric(row[keys[i]])){
            console.log("Chart unsupported: field '" + keys[i] + "' is not numeric.");
            return null;
        }
    }
    var labels = arr.map(function(o){ return o[firstKey]; });
    var datasets = [];
    var colors = ['steelblue', 'red', 'green', 'orange', 'purple', 'brown'];
    keys.slice(1).forEach(function(k, idx){
        datasets.push({
            label: k,
            data: arr.map(function(o){ return parseFloat(o[k]); }),
            borderColor: colors[idx % colors.length],
            fill: false
        });
    });
    return {labels: labels, datasets: datasets};
}

function parseJsonForLineChart(d){
    var tables = [];
    if(Array.isArray(d)){
        tables.push(d);
    }
    if(d && Array.isArray(d.observations)){
        if(d.observations.length && d.observations[0].date !== undefined && d.observations[0].value !== undefined){
            tables.push(d.observations.map(function(o){ return { date: o.date, value: o.value }; }));
        } else {
            tables.push(d.observations);
        }
    }
    for(var i=0;i<tables.length;i++){
        var parsed = parseTable(tables[i]);
        if(parsed){
            return parsed;
        }
    }
    console.log("Chart unsupported: JSON has no observations array or it is empty.");
    return null;
}

function parseCsvForLineChart(text){
    var lines = text.trim().split(/\r?\n/);
    if(lines.length < 2){
        console.log("Chart unsupported: CSV must contain a header and at least one data row.");
        return null;
    }
    var headers = lines[0].split(',');
    var rows = lines.slice(1).map(function(l){ return l.split(','); });
    var firstRow = rows[0];
    if(!isNaN(parseFloat(firstRow[0]))){
        console.log("Chart unsupported: first column must contain labels, not numbers.");
        return null;
    }
    for(var i=1;i<firstRow.length;i++){
        if(isNaN(parseFloat(firstRow[i]))){
            console.log("Chart unsupported: column '" + headers[i] + "' has non-numeric data.");
            return null;
        }
    }
    var labels = rows.map(function(r){ return r[0]; });
    var colors = ['steelblue', 'red', 'green', 'orange', 'purple', 'brown'];
    var datasets = [];
    for(var c=1;c<headers.length;c++){
        datasets.push({
            label: headers[c],
            data: rows.map(function(r){ return parseFloat(r[c]); }),
            borderColor: colors[(c-1) % colors.length],
            fill: false
        });
    }
    return {labels: labels, datasets: datasets};
}

function isDateLabel(label){
    return /^\d{4}-\d{2}-\d{2}$/.test(label);
}

function filterDataByStartDate(data, start){
    if(!start){
        return data;
    }
    var labels = [];
    var datasets = data.datasets.map(function(ds){
        return { label: ds.label, data: [] , borderColor: ds.borderColor, fill: ds.fill };
    });
    for(var i=0;i<data.labels.length;i++){
        var d = new Date(data.labels[i]);
        if(d >= start){
            labels.push(data.labels[i]);
            datasets.forEach(function(ds, idx){
                ds.data.push(data.datasets[idx].data[i]);
            });
        }
    }
    return {labels: labels, datasets: datasets};
}

function ShowChart($container){
    function renderWithButtons(fullData){
        $container.empty();
        var $chartDiv = $('<div></div>');
        $container.append($chartDiv);
        createLineChart(fullData.labels, fullData.datasets, $chartDiv);
        if(isDateLabel(fullData.labels[0])){
            var lastDate = new Date(fullData.labels[fullData.labels.length-1]);
            var ranges = [
                {label: 'all', start: null},
                {label: '5yr', start: new Date(lastDate.getFullYear()-5, lastDate.getMonth(), lastDate.getDate())},
                {label: '1yr', start: new Date(lastDate.getFullYear()-1, lastDate.getMonth(), lastDate.getDate())},
                {label: 'ytd', start: new Date(lastDate.getFullYear(), 0, 1)},
                {label: '1mo', start: new Date(lastDate.getFullYear(), lastDate.getMonth()-1, lastDate.getDate())}
            ];
            var $btnDiv = $('<div class="chart-range-buttons"></div>');
            ranges.forEach(function(r){
                var $btn = $('<button type="button" class="btn btn-secondary btn-sm"></button>').text(r.label);
                $btn.on('click', function(){
                    var filtered = filterDataByStartDate(fullData, r.start);
                    createLineChart(filtered.labels, filtered.datasets, $chartDiv);
                });
                $btnDiv.append($btn);
            });
            $container.append($btnDiv);
        }
    }

    fetch('./latest.json')
        .then(function(r){
            if(r.ok){
                return r.json();
            }
            throw new Error('no json');
        })
        .then(function(d){
            var parsed = parseJsonForLineChart(d);
            if(parsed){
                renderWithButtons(parsed);
            } else {
                throw new Error('json unsupported');
            }
        })
        .catch(function(err){
            console.log('JSON chart load failed:', err.message);
            fetch('./latest.csv')
                .then(function(r){
                    if(r.ok){
                        return r.text();
                    }
                    throw new Error('no csv');
                })
                .then(function(text){
                    var parsed = parseCsvForLineChart(text);
                    if(parsed){
                        renderWithButtons(parsed);
                    } else {
                        console.log('Chart unsupported: CSV data could not be parsed into numeric series.');
                        $container.text("This source isn't supported for charts yet.");
                    }
                })
                .catch(function(err){
                    console.log('CSV chart load failed:', err.message);
                    $container.text("This source isn't supported for charts yet.");
                });
        });
}
