var metric
  , imperial;

metric = {
    'W/mK': {
        name: {
            singular: 'Watts per meter-Kelvin',
            plural: 'Watts per meter-Kelvin',
            display: '(W/mK)'
        },
        to_anchor: 1
    }
};

imperial = {
    btuLb: {
        'Btu/hr-ft-R': {
            name: {
                singular: 'BTU per hour-feet-Rankin',
                plural: 'BTUs per hour-feet-Rankin',
                display: '(Btu/hr-ft-R)'
            },
            to_anchor: 1.7305028512
        }
    }
};

module.exports = {
  metric: metric
, imperial: imperial
, _anchors: {
    metric: {
        unit: 'W/mK',
        ratio: 1
    }
  , imperial: {
        unit: 'Btu/hr-ft-R',
        ratio: 1
    }
  }
};
