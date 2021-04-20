var force;

force = {
    N: {
        name: {
          singular: 'Newton'
          , plural: 'Newtons',
          display: '(N)'
        }
        , to_anchor: 0.22481
      }
      , lbf: {
        name: {
          singular: 'Pound-Force'
          , plural: 'Pound-Force',
          display: '(lbf)'
        }
        , to_anchor: 1
      }
};

module.exports = {
  metric: force
, _anchors: {
    metric: {
        unit: 'N'
        , ratio: 1
    }
  
  }
};
