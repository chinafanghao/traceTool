var db = require('./db');
var mongodb = new db();

function FMTree(id_no, text, parent) {
  this.id_no = id_no;
  this.text = text;
  this.parent = parent;
}

module.exports = FMTree;

FMTree.prototype.save = function save(callback) {
  var fmtree = {
    id_no: this.id_no,
    text: this.text,
    parent.this.parent,
  };
  mongodb.collection('fmtree', function(err, collection) {
    if (err) {
      //mongodb.close();
      return callback(err);
    }
      collection.insert(fmtree, {safe:true}, function(err, fmtree) {
        //mongodb.close();
        callback(err, fmtree);
      });
    });
};


FMTree.getall = function getall(callback) {
    mongodb.collection('fmtree', function(err, collection) {
    if (err) {
      //mongodb.close();
      return callback(err);
    }
  	  collection.find().sort().toArray(function(err, docs) {
  	  	//mongodb.close();
  	  	if (err) {}
  	  	var fmtree = [];
  	    docs.forEach(function(doc, index) {
  	      var node = new FMTree(doc.id_no, doc.text, doc.parent);
  	      fmtree.push(node);
  	    });
  	    callback(fmtree);
  	  });
  	});
};