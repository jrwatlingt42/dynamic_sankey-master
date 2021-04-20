var metric
  , imperial;

metric = {
    kJkg: {
        name: {
            singular: 'Kilojoule per Kilogram'
            , plural: 'Kilojoules per Kilograms',
            display: '(kJ/kg)'
        }
        , to_anchor: 1
    }
};

imperial = {
    btuLb: {
        name: {
            singular: 'Btu per lb'
            , plural: 'Btu per lbs',
            display: '(Btu/lb)'
        }
        , to_anchor: 2.326
    }
};

module.exports = {
  metric: metric
, imperial: imperial
, _anchors: {
    metric: {
        unit: 'kJkg'
        , ratio: 1
    }
  , imperial: {
    unit: 'btuLb'
    , ratio: 1
    }
  }
};
