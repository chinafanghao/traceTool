var mongodb = require('./db');
var Feature = require('./feature');
var ObjectID = require('mongodb').ObjectID;
var async = require('async'); 
function Constraint(constraint) {
  this.left      = constraint.left     ;
  this.relation  = constraint.relation ;
  this.right     = constraint.right    ;
  this.projectID = constraint.projectID;
  this._id       = constraint._id      ;
};
module.exports = Constraint;

Constraint.prototype.save = function save(callback){
  // 存入 Mongodb 的文檔
  var constraint = {
		left     : this.left     ,
		relation : this.relation ,
		right    : this.right    ,
		projectID: this.projectID,
  };
  mongodb.collection('constraints', function(err, collection) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    //collection.ensureIndex('id', {unique: true});
    collection.insert(constraint, {safe:true}, function(err, constraint) {
      //mongodb.close();
      console.log("ERROR: " + err);
      callback(err, constraint);
    });
  });
};

Constraint.get = function get(constraint, callback){
	mongodb.collection('constraints', function(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		if (constraint) {
			query.left = constraint.left;
			query.relation = constraint.relation;
			query.right = constraint.right;
			query.projectID=constraint.projectID;
		}
		collection.findOne(query, function(err, doc) {
			if (doc) {
				var constraint = new Constraint(doc);
				callback(err, constraint);
			} else {
				callback(err, null);
			}
		});
	});
};

Constraint.getAll = function getAll(callback) {
	mongodb.collection('constraints', function(err,collection) {
		if(err){
			mongodb.close();
			return callback(err);
		}
		var query = {};
		collection.find(query).sort({relation: 1}).toArray(function(err, docs) {
			if (err) {
				callback(err, null);
			}
			var constraints = [];
			docs.forEach(function(doc, index) {
				var constraint = new Constraint(doc);
				constraints.push(constraint);
			});
			var count = 0;
			async.whilst(
				function () { return count < constraints.length },
				function (cb_whilst) {
					console.log("START LOADING CONSTRAINT NO: " + count);
					
					var count_left = 0;
					var count_right = 0;

					async.series([
						function (cb_series1) {
							async.whilst(
								function () { return count_left < constraints[count].left.length },
								function (cb_w1) {
									console.log("START LOADING (CONSTARINT, LEFT_FEATURE): (" + count + ", " + count_left + ")");
									Feature.getById(constraints[count].left[count_left].item_id, function(err, feature){
										console.log("FROM DB:  " + feature.text);
										constraints[count].left[count_left].item_text = feature.text;
										count_left++;
										cb_w1();
									});
								},
								function(err) {
									console.log("FINISH LOADING CONSTRAINT NO: " + count + "\'s LEFT");
									cb_series1();
								}
							);
						},

						function (cb_series2) {
							async.whilst(
								function () { return count_right < constraints[count].right.length },
								function (cb_w2) {
									console.log("START LOADING (CONSTARINT, RIGHT_FEATURE): (" + count + ", " + count_right + ")");
									Feature.getById(constraints[count].right[count_right].item_id, function(err, feature){
										console.log("FROM DB: " + feature.text);
										constraints[count].right[count_right].item_text = feature.text;
										count_right++;
										cb_w2();
									});
								},
								function (err) {
									console.log("FINISH LOADING CONSTRAINT NO: " + count + "\'s RIGHT");
									cb_series2();
								}
							);
						},
					], function(err) {
						count++;
						cb_whilst();
					});	
				},
    		function(err) {
	        console.log('err: ', err); // -> undefined
	        callback(null, constraints);
    		} 
			);
		});
	});
};

Constraint.getById = function getById(projectID,callback) {
	mongodb.collection('constraints', function(err,collection) {
		if(err){
			mongodb.close();
			return callback(err);
		}
		var query = {};
		query={"projectID":projectID};
		collection.find(query).sort({relation: 1}).toArray(function(err, docs) {
			if (err) {
				callback(err, null);
			}
			var constraints = [];
			docs.forEach(function(doc, index) {
				var constraint = new Constraint(doc);
				constraints.push(constraint);
			});
			var count = 0;
			async.whilst(
				function () { return count < constraints.length },
				function (cb_whilst) {
					console.log("START LOADING CONSTRAINT NO: " + count);
					
					var count_left = 0;
					var count_right = 0;

					async.series([
						function (cb_series1) {
							async.whilst(
								function () { return count_left < constraints[count].left.length },
								function (cb_w1) {
									console.log("START LOADING (CONSTARINT, LEFT_FEATURE): (" + count + ", " + count_left + ")");
									Feature.getById(constraints[count].left[count_left].item_id, function(err, feature){
										console.log("FROM DB:  " + feature.text);
										constraints[count].left[count_left].item_text = feature.text;
										count_left++;
										cb_w1();
									});
								},
								function(err) {
									console.log("FINISH LOADING CONSTRAINT NO: " + count + "\'s LEFT");
									cb_series1();
								}
							);
						},

						function (cb_series2) {
							async.whilst(
								function () { return count_right < constraints[count].right.length },
								function (cb_w2) {
									console.log("START LOADING (CONSTARINT, RIGHT_FEATURE): (" + count + ", " + count_right + ")");
									Feature.getById(constraints[count].right[count_right].item_id, function(err, feature){
										console.log("FROM DB: " + feature.text);
										constraints[count].right[count_right].item_text = feature.text;
										count_right++;
										cb_w2();
									});
								},
								function (err) {
									console.log("FINISH LOADING CONSTRAINT NO: " + count + "\'s RIGHT");
									cb_series2();
								}
							);
						},
					], function(err) {
						count++;
						cb_whilst();
					});	
				},
    		function(err) {
	        console.log('err: ', err); // -> undefined
	        callback(null, constraints);
    		} 
			);
		});
	});
};


Constraint.remove = function remove(constraint_id, callback){
	mongodb.collection('constraints', function(err,collection) {
		if(err){
			mongodb.close();
			return callback(err);
		}
		var query = {};
		query._id = ObjectID(constraint_id);
		collection.remove(query, function (err) {
			//mongodb.close();
			callback(err);
		});
	});
};