if (document.getElementById) {
  var tree = new FMTree('Editor', 'It is the root feature.', null, null, 'root_old_father');

  $.ajax({
    type:"POST",
    url: "/loadFeatureModel",
    data: {
          projectID:$("#hidden_project_id").val()
                },
    success: function(data) {
      data.features.forEach(function(feature, index) {
        var node = new FMTreeItem(feature.text, feature.description, feature.optionality, feature.VP, feature._id);       
        var parent = FMTreeHandler.idPrefix + feature.parent_id;
        FMTreeHandler.all[parent].add(node);
      });
    },
  });
 
    document.write(tree);
}