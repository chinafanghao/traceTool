if (document.getElementById) {
	var tree = new FMTree('Graph', 'It is the root feature.');
  /*  
	var g1 = new FMTreeItem('Attribute', 'It is a feature which is responsible for the attribute part of the Graph software.', 'Mandatory');
	tree.add(g1);
	var g1_1 = new FMTreeItem('Direction', 'It is a feature which is responsible for the direction part of the Graph software.', 'Mandatory');
	g1.add(g1_1);
	g1_1.add(new FMTreeItem('Directed', 'The direction part of the Graph software is directed.'));
	g1_1.add(new FMTreeItem('Undirected', 'The direction part of the Graph software is undirected.'));
	var g1_2 = new FMTreeItem('Weight', 'It is a feature which is responsible for the weight part of the Graph software.', 'Mandatory');
	g1.add(g1_2);
	g1_2.add(new FMTreeItem('Weighted', 'The weight part of the Graph software is weighted.'));
	g1_2.add(new FMTreeItem('Non-weighted', 'The weight part of the Graph software is non-weighted.'));

	var g2 = new FMTreeItem('GraphIO', 'It is a feature which is responsible for the graph IO part of the Graph software.', 'Optional');
	tree.add(g2);
	var g2_1 = new FMTreeItem('Graph factory', 'It is a feature which is responsible for the graph factory part of the Graph software.');
	g2.add(g2_1);
	var g2_1_1 = new FMTreeItem('Random', 'The graph factory part of the Graph software is random.');
	g2_1.add(g2_1_1);
	var g2_1_2 = new FMTreeItem('Input', 'The graph factory part of the Graph software is imput.');
	g2_1.add(g2_1_2);
	var g2_2 = new FMTreeItem('Graph display', 'It is a feature which is responsible for the garph display part of the Graph software.');
	g2.add(g2_2);

	var g3 = new FMTreeItem('Algorithm', 'It is a feature which is responsible for the algorithm part of the Graph software.', 'Optional');
	tree.add(g3);
	var g3_1 = new FMTreeItem('Search', 'It is a feature which is responsible for the search part of the Graph software.', 'Optional');
	g3.add(g3_1);
	var g3_1_1 = new FMTreeItem('BFS', 'The search part of the Graph software is BFS.');
	g3_1.add(g3_1_1);
	var g3_1_2 = new FMTreeItem('DFS', 'The search part of the Graph software is DFS.');
	g3_1.add(g3_1_2);
	var g3_2 = new FMTreeItem('Connection', 'It is a feature which is responsible for the connection part of the Graph software.', 'Mandatory');
	g3.add(g3_2);
	var g3_2_1 = new FMTreeItem('Simple', 'The connection part of the Graph software is simple.');
	g3_2.add(g3_2_1);
	var g3_2_2 = new FMTreeItem('Hamilton', 'The connection part of the Graph software is Hamilton.');
	g3_2.add(g3_2_2);
	var g3_3 = new FMTreeItem('MST', 'It is a feature which is responsible for the MST part of the Graph software.', 'Optional');
	g3.add(g3_3);
	var g3_3_1 = new FMTreeItem('Prim', 'The MST part of the Graph software is Prim.');
	g3_3.add(g3_3_1);
	var g3_3_2 = new FMTreeItem('Kruskal', 'The MST part of the Graph software is Kruskal.');
	g3_3.add(g3_3_2);
	var g3_4 = new FMTreeItem('SPT', 'It is a feature which is responsible for the SPT part of the Graph software.', 'Optional');
	g3.add(g3_4);
	var g3_4_1 = new FMTreeItem('Dijkstra', 'The SPT part of the Graph software is Dijkstra.');
	g3_4.add(g3_4_1);
	var g3_4_2 = new FMTreeItem('Floyd', 'The SPT part of the Graph software is Floyd.');
	g3_4.add(g3_4_2);*/
	document.write(tree);
}
