var specificVolume;

specificVolume = {
    m3kg: {
        name: {
            singular: 'Cubic Meter per Kilogram',
            plural: 'Cubic Meters per Kilogram',
            display: '(m&#x00B3;/kg)'
        },
        to_anchor: 1
    },
    m3g: {
        name: {
            singular: 'Cubic Meter per Gram',
            plural: 'Cubic Meters per Gram',
            display: '(m&#x00B3;/g)'
        },
        to_anchor: 1000
    },
    ft3lb: {
        name: {
            singular: 'Cubic Foot per Pound',
            plural: 'Cubic Feet per Pound',
            display: '(ft&#x00B3;/lb)'
        },
        to_anchor: 1 / 16.0185
    },
    gallb: {
        name: {
            singular: 'Gallon per Pound',
            plural: 'Gallons per lb',
            display: '(gal/lb)'
        },
        to_anchor: 1 / 119.826
    }
};

module.exports = {
  metric: specificVolume
, _anchors: {
    metric: {
        unit: 'm3kg'
        , ratio: 1
    }
  
  }
};
