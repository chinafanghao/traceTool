var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Feature(feature) {
  this.text        = feature.text        ;
  this.parent_id   = feature.parent_id   ;
  this.description = feature.description ;
  this.root        = feature.root        ;
  this.optionality = feature.optionality ;
  this.VP          = feature.VP          ;
  this.level       = feature.level       ;
  this._id         = feature._id         ;
  this.projectID   = feature.projectID   ;
};
module.exports = Feature;
//
Feature.prototype.save = function save(callback){
  // 存入 Mongodb 的文檔
  console.log('HI');
  var feature = {
		text        : this.text        ,
		parent_id   : this.parent_id   ,
		description : this.description ,
		root        : this.root        ,
		optionality : this.optionality ,
		VP          : this.VP          ,
		level       : this.level       ,
		projectID   : this.projectID   ,
  };
  console.log('HELLO');
  mongodb.collection('fmtree', function(err, collection) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    console.log("WHAT THE FUCK IS GOING ON?");
    //collection.ensureIndex('id', {unique: true});
    collection.insert(feature, {safe:true}, function(err, feature) {
      //mongodb.close();
      console.log("WHAT's GOING ON HUH?  " + err);
      callback(err, feature);
    });
  });
};

Feature.getById = function getById(feature_id, callback) {
  mongodb.collection('fmtree', function(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		if (feature_id) {
			query._id = ObjectID(feature_id);
		}
		collection.findOne(query, function(err, doc) {
			if (doc) {
				var feature = new Feature(doc);
				callback(err, feature);
			} else {
				callback(err, null);
			}
		});
	});
};

Feature.getByTextAndRoot = function getByTextAndRoot(feature_text, feature_root, callback) {
	mongodb.collection('fmtree', function(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		if (feature_text && feature_root) {
			query.text = feature_text;
			query.root = feature_root;
		}
		collection.findOne(query, function(err, doc) {
			if (doc) {
				var feature = new Feature(doc);
				callback(err, feature);
			} else {
				callback(err, null);
			}
		});
	});
};
	
Feature.getAll = function getAll(callback) {
  mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		collection.find(query).sort({level: 1, text:1}).toArray(function(err, docs) {
			//mongodb.close();
			if (err) {
				callback(err, null);
			}

			var features = [];
			docs.forEach(function(doc, index) {
				var feature = new Feature(doc);
				features.push(feature);
			});
			callback(null, features);
		});
	});
};


Feature.getByProject = function getByProject(projectID,callback) {
	console.log("getByProject");
  mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {"projectID":projectID};
		collection.find(query).sort({level: 1, text:1}).toArray(function(err, docs) {
			//mongodb.close();
			if (err) {
				callback(err, null);
			}

			var features = [];
			docs.forEach(function(doc, index) {
				var feature = new Feature(doc);
				features.push(feature);
			});
			callback(null, features);
		});
	});
};


Feature.remove = function remove(feature_id, callback) {
	mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		query._id = ObjectID(feature_id);
		collection.remove(query, function (err) {
			//mongodb.close();
			callback(err);
		});
	});
};

Feature.removeSubtree = function removeSubtree(feature_id, callback) {
	mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		console.log("这是根remove，即将开始移除" + feature_id + "及其子树"+feature_id.length+"\n");
		Feature._removeSubtree(collection, feature_id);
		callback(err);
	});
};

Feature._removeSubtree = function _removeSubtree (collection, feature_id) {
	//找出所有feature_id的子结点并对其递归调用_removeSubtree
  //console.log("已进入移除"+feature_id+"的函数中，准备找出所有它的子结点\n");
	var query = {};
	query.parent_id = feature_id;
	collection.find(query).sort({level: 1, text:1}).toArray(function(err, docs) {
		console.log(feature_id+"的找子结点工作已经完成，检查是否有错\n")
		if (err) {
			console.log(feature_id + "在找子结点时报错: \n" + err);
			//callback(err, null);
		}
		docs.forEach(function(doc, index) {
			var temp_id = doc._id.toString();
			console.log("即将开始移除" + temp_id + "及其子树"+"\n");
			Feature._removeSubtree(collection, temp_id);
		});
		//callback(null, features);
	});
	console.log(feature_id+"的子结点已经处理完毕，准备移除自己");
	var query = {};
	query._id = ObjectID(feature_id);
	console.log("即将开始移除" + feature_id + "自己\n");
	collection.remove(query, function (err) {
		if(err)
			console.log("移除" + feature_id + "时出错："+err + "\n");
		else
			console.log(feature_id + " 已被成功移除!!!\n");
	});
}

Feature.updateText = function updateText(feature_id, newText, callback) {
		mongodb.collection('fmtree', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			query._id = ObjectID(feature_id);
			var newFeature = {};
			newFeature.text = newText;
			collection.update(query, {$set: newFeature}, function (err) {
				//mongodb.close();
				callback(err);
			});
		});
};

Feature.updateDescription = function updateDescription(feature_id, newDescription, callback) {
		mongodb.collection('fmtree', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			query._id = ObjectID(feature_id);
			var newFeature = {};
			newFeature.description = newDescription;
			collection.update(query, {$set: newFeature}, function (err) {
				//mongodb.close();
				callback(err);
			});
		});
};

Feature.updateOptionality = function updateOptionality(feature_id, newOptionality, callback) {
	mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		query._id = ObjectID(feature_id);
		var newFeature = {};
		newFeature.optionality = newOptionality;
		collection.update(query, {$set: newFeature}, function (err) {
			//mongodb.close();
			callback(err);
		});
	});
};

Feature.updateParent_id = function updateParent_id(feature_id, newParent_id, callback) {
	mongodb.collection('fmtree', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		console.log("CURRENT　FEATURE IS: "+feature_id);
		console.log("NEW PARENT IS: "+newParent_id);
		var query = {};
		query._id = ObjectID(feature_id);
		var newFeature = {};
		newFeature.parent_id = newParent_id;
		collection.update(query, {$set: newFeature}, function (err) {
			var query = {};
			query._id = ObjectID(newParent_id);
			collection.findOne(query, function(err, doc) {
				Feature.updateLevel(collection, feature_id, doc.level+1);
			});
			//mongodb.close();
			callback(err);
		});
	});
};

Feature.updateLevel = function updateLevel(collection, feature_id, newLevel) {
	var query1 = {};
	query1._id = ObjectID(feature_id);
	var newFeature = {};
	newFeature.level = newLevel;
	collection.update(query1, {$set: newFeature}, function (err) {
		//
	});
	var query2 = {};
	query2.parent_id = feature_id
	collection.find(query2).sort({level: 1, text:1}).toArray(function(err, docs) {
		if (err) {
			//callback(err, null);
		}
		docs.forEach(function(doc, index) {
			var temp_id = doc._id.toString();
			Feature.updateLevel(collection, temp_id, newLevel+1);
		});
		//callback(null, features);
	});

}

Feature.updateVP = function updateVP(feature_id, newVP, callback) {
	mongodb.collection('fmtree', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			query._id = ObjectID(feature_id);
			var newFeature = {};
			newFeature.VP = newVP;
			collection.update(query, {$set: newFeature}, function (err) {
				//mongodb.close();
				callback(err);
			});
		});
};

