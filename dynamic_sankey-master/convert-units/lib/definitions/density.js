var metric
  , imperial;

  metric = {
        kgNm3: {
            name: {
                singular: 'Kilogram per Cubic Meter'
                , plural: 'Kilograms per Cubic Meter',
                display: '(kg/m&#x00B3)'
            }
            , to_anchor: 1
        }
        , kgL: {
          name: {
            singular: 'Kilogram per Litter'
            , plural: 'Kilograms per Litter' ,
            display: '(kg/L)'
          }
        , to_anchor: 1000
      }
    };
    imperial = {
        lbscf: {
            name: {
                singular: 'Pound per Cubic Foot'
                , plural: 'Pounds per Cubic Foot',
                display: '(lb/ft&#x00B3)'
            }
            , to_anchor: 1
        }
        , lbgal: {
          name: {
            singular: 'Pound per Gallon'
            , plural: 'Pounds per Gallon' ,
            display: '(lb/gal)'
          }
          , to_anchor: 7.48052
      }
    };

    module.exports = {
        metric: metric
      , imperial: imperial
      , _anchors: {
          metric: {
            unit: 'kgNm3'
            , ratio: 1 / 16.0185
          }
        , imperial: {
            unit: 'lbscf'
            , ratio: 16.0185
          }
        }
      };