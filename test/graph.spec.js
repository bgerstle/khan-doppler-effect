width = 10;
height = 10;

describe('denormalized', function () {
  var graph = new Graph();

  // set global width & heights as is expected in Khan Academy env
  it('0,0 goes to the middle of the graph', function () {
    expect(graph.denormalized({x: 0, y: 0}))
    .toEqual({x: graph.width / 2, y: graph.height / 2});
  });

  it('1,1 goes to the upper right corner', function () {
    expect(graph.denormalized({x: 1, y: 1}))
    .toEqual({x: graph.width, y: 0});
  });

  it('-1,-1 goes to the lower left corner', function () {
    expect(graph.denormalized({x: -1, y: -1}))
    .toEqual({x: 0, y: graph.height});
  });
});
