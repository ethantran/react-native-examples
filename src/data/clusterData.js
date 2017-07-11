import * as d3Array from 'd3-array';
export default function(numNodes = 200, numClusters = 10, maxRadius = 12) {
    var clusters = new Array(numClusters);
    var nodes = d3Array.range(numNodes).map(function() {
        var i = Math.floor(Math.random() * numClusters),
            r = Math.sqrt((i + 1) / numClusters * -Math.log(Math.random())) * maxRadius,
            d = { cluster: i, radius: r };
        if (!clusters[i] || r > clusters[i].radius) {clusters[i] = d;}
        return d;
    });
    return {
        clusters,
        nodes
    };
}
