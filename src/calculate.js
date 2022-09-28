const COUNT_ABBRS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
var sort, round, min, max, range, sum, median, mean, deviation, variance, standardDeviation, standardize,
    rank, correlation, distance, pairwiseDistance, hierarchicalClustering, formatCount;


formatCount = function (count, withAbbr = false, decimals = 2) {
    const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));
    let result = parseFloat((count / Math.pow(1000, i)).toFixed(decimals));
    if (withAbbr) {
        result += `${COUNT_ABBRS[i]}`;
    }
    return result;
}

// @param {[number]} x Array of numbers.
sort = function (x) {
    var copy;
    // Copy array.
    copy = x.slice();
    return copy.sort(function (a, b) {
        return a - b;
    });
};

// @param {number} x Number to round.
// @param {number} [n] Number of decimal places.
round = function (x, n) {
    n = typeof n === "number" ? n : 0;
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
};

// @param {[number]} x Array of numbers.
min = function (x) {
    var min, i, n;
    min = Infinity;
    for (i = 0, n = x.length; i < n; i++) {
        if (x[i] < min) {
            min = x[i];
        }
    }
    return min;
};

// @param {[number]} x Array of numbers.
max = function (x) {
    var max, i, n;
    max = -Infinity;
    for (i = 0, n = x.length; i < n; i++) {
        if (x[i] > max) {
            max = x[i];
        }
    }
    return max;
};

// @param {number} start Start value.
// @param {number} stop Stop value.
range = function (start, stop) {
    var len, range, idx;
    len = stop - start;
    range = new Array(len);
    for (idx = 0; idx < len; idx++) {
        range[idx] = start++;
    }
    return range;
};

// @param {[number]} x Array of numbers.
sum = function (x) {
    var sum, i, n;
    sum = 0;
    for (i = 0, n = x.length; i < n; i++) {
        sum += x[i];
    }
    return sum;
};

// @param {[number]} x Array of numbers.
median = function (x) {
    var sorted;
    if (x.length === 1) {
        return x[0];
    } else {
        sorted = sort(x);
        if (sorted.length % 2 === 0) {
            return mean([x[(sorted.length / 2) - 1], x[sorted.length / 2]]);
        } else {
            return x[Math.floor(sorted.length / 2)];
        }
    }
};

// @param {[number]} x Array of numbers.
mean = function (x) {
    return sum(x) / x.length;
};

// @param {[number]} x Array of numbers.
deviation = function (x) {
    var xBar, n, d, i;
    xBar = mean(x);
    n = x.length;
    d = new Array(n);
    for (i = 0; i < n; i++) {
        d[i] = x[i] - xBar;
    }
    return d;
};

// Calculates the variance.
// @param {[number]} x Array of numbers.
// @param {boolean} [bias] If true, the biased sample variance is used.
variance = function (x, bias) {
    var d, i, n;
    bias = typeof bias === "boolean" ? bias : false;
    d = deviation(x);
    n = d.length;
    for (i = 0; i < n; i++) {
        d[i] = Math.pow(d[i], 2);
    }
    return sum(d) / (n - (bias === false ? 1 : 0));
};

// Calculates the sample standard deviation.
// @param {[number]} x Array of numbers.
// @param {boolean} [bias] If true, the biased sample variance is used.
standardDeviation = function (x, bias) {
    bias = typeof bias === "boolean" ? bias : false;
    return Math.sqrt(variance(x, bias));
};

// @param {[number]} x Array of numbers.
standardize = function (x) {
    var sd, d, i, n;
    sd = standardDeviation(x);
    d = deviation(x);
    for (i = 0, n = d.length; i < n; i++) {
        d[i] = d[i] / sd;
    }
    return d;
};

// @param {[number]} x Array of numbers.
rank = function (x) {
    var sorted, d, i, n;
    n = x.length;
    sorted = sort(x);
    d = new Array(n);
    for (i = 0; i < n; i++) {
        var rank, first, last;
        // Handle tied ranks.
        first = sorted.indexOf(x[i]);
        last = sorted.lastIndexOf(x[i]);
        if (first === last) {
            rank = first;
        } else {
            rank = (first + last) / 2;
        }
        // Add 1 because ranks start with 1.
        d[i] = rank + 1;
    }
    return d;
};

// Calculates the correlation coefficient for two variables.
// @param {[number]} x Array of numbers.
// @param {[number]} y Array of numbers.
correlation = {
    // @param {boolean} [standardize] If false, x and y will not be standardized.
    pearson: function (x, y, sdd) {
        var n, d, i;
        sdd = typeof sdd === "boolean" ? sdd : true;
        if (sdd === true) {
            x = standardize(x);
            y = standardize(y);
        }
        n = x.length;
        d = new Array(n);
        for (i = 0; i < n; i++) {
            d[i] = x[i] * y[i];
        }
        return sum(d) / (n - 1);
    },
    // @param {boolean} [rank] If false, x and y will not be ranked.
    spearman: function (x, y, rank) {
        var xDeviation, yDeviation;
        rank = typeof rank === "boolean" ? rank : true;
        if (rank === true) {
            x = rank(x);
            y = rank(y);
        }
        xDeviation = deviation(x);
        yDeviation = deviation(y);
        return sum(xDeviation.map(function (xi, i) {
            return xi * yDeviation[i];
        })) / Math.sqrt(sum(xDeviation.map(function (xi) {
            return Math.pow(xi, 2);
        })) * sum(yDeviation.map(function (yi) {
            return Math.pow(yi, 2);
        })));
    }
};

// @param {[number]} x Array of numbers.
// @param {[number]} y Array of numbers.
distance = {
    euclidean: function (x, y) {
        return Math.sqrt(sum(x.map(function (xi, i) {
            return Math.pow(xi - y[i], 2);
        })));
    },
    manhattan: function (x, y) {
        return sum(x.map(function (xi, i) {
            return Math.abs(xi - y[i]);
        }));
    }
};

// @param {[[number]]} x Array of array of numbers.
// @param {(x, y)} distanceMetric Distance metric.
// TODO: Save memory by throwing away upper or lower triangle and diagonal.
pairwiseDistance = function (x, distanceMetric) {
    var pairwiseDistances, distance, i, j;
    pairwiseDistances = [];
    for (i = 0; i < x.length; i++) {
        pairwiseDistances[i] = [];
        for (j = 0; j <= i; j++) {
            if (i === j) {
                pairwiseDistances[i][j] = 0;
            } else {
                distance = distanceMetric(x[i], x[j]);
                pairwiseDistances[i][j] = distance;
                pairwiseDistances[j][i] = distance;
            }
        }
    }
    return pairwiseDistances;
};

// @param {[[number]]} pairwiseDistances Pairwise distance matrix.
// @param {string} linkage Linkage criterion.
// Inspired by Heather Arthur's clusterfck: https://github.com/harthur/clusterfck
hierarchicalClustering = function (pairwiseDistances, linkage) {
    var clusters, minDistance, clusterA, clusterB, distance, distanceA,
        distanceB, candidates, mergedCluster, i, j;
    if (["single", "complete", "upgma"].indexOf(linkage) === -1) {
        throw new Error("The second argument (linkage) has to be either one of \"single\", \"complete\", or \"upgma\".");
    }
    clusters = [];
    // Initialize one cluster per observation.
    for (i = 0; i < pairwiseDistances.length; i++) {
        clusters.push({
            label: i,
            key: i,
            index: i,
            size: 1
        });
    }
    while (true) {
        // Stop if all clusters have been merged into a single cluster.
        if (clusters.length === 1) {
            delete clusters[0].index;
            delete clusters[0].key;
            break;
        }
        // Find closest clusters.
        minDistance = Infinity;
        for (i = 0; i < clusters.length; i++) {
            clusterA = clusters[i];
            for (j = 0; j < clusters.length; j++) {
                if (i !== j) {
                    clusterB = clusters[j];
                    distance = pairwiseDistances[clusterA.key][clusterB.key];
                    if (distance < minDistance) {
                        minDistance = distance;
                        candidates = [clusterA, clusterB];
                    }
                }
            }
        }
        // Merge clusters.
        mergedCluster = {
            children: candidates,
            key: candidates[0].key,
            distance: minDistance,
            size: candidates[0].size + candidates[1].size
        };
        // Replace first cluster with merged cluster in list of clusters.
        clusters[candidates[0].index] = mergedCluster;
        // Remove second cluster from list of clusters.
        clusters.splice(candidates[1].index, 1);
        // Recompute distances from merged cluster to all other clusters.
        for (i = 0; i < clusters.length; i++) {
            if (clusters[i].key === candidates[0].key) {
                distance = 0;
            } else {
                distanceA = pairwiseDistances[candidates[0].key][clusters[i].key];
                distanceB = pairwiseDistances[candidates[1].key][clusters[i].key];
                switch (linkage) {
                    case "single":
                        if (distanceA < distanceB) {
                            distance = distanceA;
                        } else {
                            distance = distanceB;
                        }
                        break;
                    case "complete":
                        if (distanceA > distanceB) {
                            distance = distanceA;
                        } else {
                            distance = distanceB;
                        }
                        break;
                    case "upgma":
                        distance = ((distanceA * candidates[0].size) + (distanceB * candidates[1].size)) / (candidates[0].size + candidates[1].size);
                        break;
                }
            }
            pairwiseDistances[candidates[0].key][clusters[i].key] = distance;
            pairwiseDistances[clusters[i].key][candidates[0].key] = distance;
        }
        // Remove column of second cluster from pairwise distance matrix.
        for (i = 0; i < pairwiseDistances.length; i++) {
            pairwiseDistances[i].splice(candidates[1].key, 1);
        }
        // Remove row of second cluster from pairwise distance matrix.
        pairwiseDistances.splice(candidates[1].key, 1);
        // Update keys of clusters to reflect removal of the column.
        for (i = candidates[1].key; i < clusters.length; i++) {
            clusters[i].key--;
        }
        // Remove obsolete key and index of merged clusters.
        delete candidates[0].key;
        delete candidates[0].index;
        delete candidates[1].key;
        delete candidates[1].index;
        // Reindex clusters.
        for (i = 0; i < clusters.length; i++) {
            clusters[i].index = i;
        }
    }
    return clusters;
};

export {
    sort, round, min, max, range, sum, median, mean, deviation, variance, standardDeviation, standardize,
    rank, correlation, distance, pairwiseDistance, hierarchicalClustering, formatCount
}