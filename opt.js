/**
* Represents a node with in the parse tree. 
* Each node has a set of children.
*/
function Operator () {
  this.init.apply ( this, arguments );
  return this;
}
Operator.prototype = {
  init: function  () {
    var optns = arguments[0] || {};
    this.name = optns.name || "nameless";
    this.parent = optns.parent;
  },
  setChildren: function (children) {
    this.children = children;  
  },
  /* Get a list of children */
  getChildren: function () {
    return this.children;
  },
  /* Update the table name */
  setTableName: function (tableName) {
    this.tableName = tableName
  },
  setAttributes: function (attrList) {
    this.attrNames = attrList;
  },
  
  /* Returns information for a table, i.e., table name and a set attributes */
  getTableDtls: function() {
    return {name:this.tableName, attrs:this.attrNames};
  },
  getChild: function (argNo) {
   return this.children[argNo];
  },
  
  /* Move the node  current between node1 and node2 */
  moveNode: function (node1, node2) {
    var indexToReplace = node1.children.indexOf(node2);
    node2.parent = this;
    node1.children[indexToReplace] = this;
    this.parent = node1;
    this.children[0] = node2;
  },
  
  
  toString: function() {
    var out = this.name;
    out = out.concat("(");
    out = out.concat(this.children.join());
    out = out.concat(")");
    return out;
  },
  execute : function () {
    return this.name;
  }  
}

/**
* Check if the specified operator name is valid.
*
* @param {Operator} root of the query tree.
*/

function isValidOperator_(operatorName)
{
  var operators = ["select", "project", "union", "xjoin", "rename"];
  if (operators.indexOf(operatorName) > -1)
    return true;
  else 
    return false;
}
 
/**
* Do a DFS traversal of the query tree and polulate the attribute names.
*
* @param {Operator} root of the query tree.
*/
function populateAttributeNames_(queryTree)
{
  /* Update for children */
  var children = queryTree.getChildren();
  for (var i=0;i<children.length;i++)
  {
    var type = typeof children[i];
    if (typeof children[i] == "object")
      populateAttributeNames_(children[i]);
  }
  /* Directly get them from children */
  var tableNameFromChild = -1;
  var attrsFromChild = -1;
  /* Update for self */
  if (queryTree.name == "project")
  {
    tableNameFromChild=0;
    var args = queryTree.getChild(1).replace(/[\{\}\"]/g , "").split(',');
    queryTree.setAttributes(args);
  }
  else if (queryTree.name == "rename")
  {
    queryTree.setTableName(queryTree.getChild(1));
    if (queryTree.getChild(2))
    {
      var args = queryTree.getChild(2).replace(/[\{\}\"]/g , "").split(',');
      queryTree.setAttributes(args);
    }
    else
      attrsFromChild = 0;
  }   
  else if (queryTree.name == "select" || queryTree.name == "union") {
    tableNameFromChild = 0;
    attrsFromChild = 0;
  }
  else if (queryTree.name == "xjoin")
  {
    if (typeof children[0] == "object")
      var table1_dtls = children[0].getTableDtls();
    else 
      var table1_dtls = getAttributeNamesFromSheet(children[0]);
    
    if (typeof children[1] == "object")
      var table2_dtls = children[1].getTableDtls();
    else 
      var table2_dtls = getAttributeNamesFromSheet(children[1]);
    queryTree.setTableName(table1_dtls.name 
                           + "_" 
                           + table2_dtls.name);
    var joinColumns=generateUniqueHeaders(table1_dtls.name, 
                                          table1_dtls.attrs, 
                                          table2_dtls.name, 
                                          table2_dtls.attrs);
    queryTree.setAttributes(joinColumns);
  } 

  if (tableNameFromChild != -1 || attrsFromChild != -1)
  {
    var max_attr = Math.max(tableNameFromChild, attrsFromChild);
    if (typeof children[max_attr] == "object")
      var table1_dtls = children[max_attr].getTableDtls();
    else 
      var table1_dtls = getAttributeNamesFromSheet(children[max_attr]);
    if (tableNameFromChild != -1)
       queryTree.setTableName(table1_dtls.name);
    if (attrsFromChild != -1)
       queryTree.setAttributes(table1_dtls.attrs);
  }
}

function getAttributeNamesFromSheet(range)
{
 var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (range.indexOf("!") == -1) {
    var sheet = ss.getSheets()[0];
    var values = sheet.getRange(range).getValues();
  }
  else {
    var rangeSplit = range.split('!');
    var sheet = ss.getSheetByName(rangeSplit[0].trim());
    var values = sheet.getRange(rangeSplit[1]).getValues();
  }
  return ({name:values[0][0], attrs:values[1]});
}

function pushSelection_(queryTree)
{
  /* Check if the operator is selection */
  if (queryTree.name == "select")
  {
    var select_child = queryTree.getChildren()[0];
    /* Check if the child is a projection */
    if (typeof select_child == "object" && select_child.name == "project")
    {
      // Selection can be moved down.
      queryTree.moveNode(select_child, select_child.getChildren()[0]);
      
      /* Update the root of the tree */
      queryTree=select_child;
    }
    else if (typeof select_child == "object" && select_child.name == "xjoin")
    {
      /****************************************************************/
      /***************** Write your code here *************************/ 
      /****************************************************************/
      
      
    }
    else if (typeof select_child == "object" && select_child.name == "union")
    {
      /****************************************************************/
      /***************** Write your code here *************************/ 
      /****************************************************************/
      var theDeetz = select_child.getTableDtls;
      var attributesChild = theDeetz.atrrNames;
      var attributesParent = queryTree.getTableDtls.attrNames;

      var flag = 0;
      for(var i =0;i<Math.max(attributesChild.length,attributesParent.length);i++){
          if(attributesChild[i] == attributesParent[i]){
            queryTree.moveNode(select_child,select_child.getChildren[0]);
            queryTree = select_child;
            break;
          } 
        

      }


      
      
    }


  }
    
  /* Do a DFS and search for selection */
  var children = queryTree.getChildren();
  for (var i=0;i<children.length;i++)
  {
    if (typeof children[i] == "object")
      children[i] = pushSelection_(children[i]);
  }
  return queryTree;
}


/**
* Optimize the input query by re-writting it based on rules.
*
* @param {string} query string
* @return {string} root of the query tree.
*/
function optimizeQuery(ra_query)
{
  /* Obtain the query tree */
  var queryTree = getQueryTree_(ra_query, null);
  
  /* Update the attribute names for each of the operators */
  populateAttributeNames_(queryTree);
 
  /* Optimization 1: Push selection down */
  queryTree = pushSelection_(queryTree);
   
  
  /* Return the updated query */
  return queryTree.toString();
}

/**
* Parse the query to obtain an execution tree.
*
* @param {string} query string
* @return {Operator} root of the query tree.
*/
function getQueryTree_(ra_query, parent)
{
  var mode = 0;
  /*
  0 - start search for operator name
  1 - search for arguments
  2 - wait for closing
  3 - ignore
  */

  var oper_args=[]; 
  for (var i=0; i < ra_query.length; i++)
  {
    switch (mode)
    {
      case 0:   
        if (ra_query[i]=='(') {
          var operatorName = ra_query.substring(0,i).toLowerCase();          
          if (isValidOperator_(operatorName)) {
            mode = 1;
            var argument_start = i+1;
            var operator = new Operator({name:operatorName, parent:parent});
          }
        }
        if (i==ra_query.length-1)
        {
          return ra_query;
        }
        break;
      case 1:
        if (ra_query[i]=='(' || ra_query[i]=='\'' || ra_query[i]=='"' || ra_query[i]=='{') {
          var open = [];
          open.push(ra_query[i]);
          mode = 2;
          break;
        } 
        else if (ra_query[i]=="," || ra_query[i]==")")
        {
          oper_args.push(getQueryTree_(ra_query.substring(argument_start,i).trim(), operator));
          argument_start = i+1;
        }
        if (ra_query[i]==")")
          mode = 3;
        break;
      case 2:
        var ch = ra_query[i];
        var last_open=open[open.length-1];
        if ((last_open=="(" && ra_query[i]==")") 
            || (last_open=="{" && ra_query[i]=="}")
          || (last_open!="(" && last_open!="{" && ra_query[i]==last_open)) {
          open.pop();
        }
        else if (ra_query[i]=='(' || ra_query[i]=='\'' || ra_query[i]=='"') {
          open.push(ra_query[i]);
        }
        if (open.length==0)
          mode = 1;
    }
  }
  operator.setChildren(oper_args);
  return operator;
}
