var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    iconv_lite = require('iconv-lite');

var ArrayProto = Array.prototype,
    push       = ArrayProto.push;

var domParser = require('xmldom').DOMParser;

var targetDir = '/Users/maninzoo/Contents/temp/09_23_2015/conversion/test2/';

var storeData = function ( node, result ) {
  var i,
      nodeName,
      nodes,
      namedNodeMap,
      attr,
      itemResult;

  // ELEMENT_NODE
  if ( node.nodeType === 1 ) {
    nodeName = node.nodeName;

    if ( nodeName !== 'Datasets' && nodeName !== 'Script' ) {
      if ( result[nodeName] ) {
        result[nodeName].count += 1;
      } else {
        console.log( nodeName );
        result[nodeName] = {};
        result[nodeName].count = 1;
      }

      if ( node.hasAttributes() ) {
        if ( !result[nodeName].attrs ) {
          result[nodeName].attrs = {};
        }
        namedNodeMap = node.attributes;

        for ( i = 0; i < namedNodeMap.length; i++ ) {
          attr = namedNodeMap.item(i);

          if ( result[nodeName].attrs[attr.name] ) {
            result[nodeName].attrs[attr.name] += 1;
          } else {
            result[nodeName].attrs[attr.name] = 1;
          }
        }
      }

      if ( node.hasChildNodes() ) {
        if ( nodeName === 'Grid' || nodeName === 'Radio' || nodeName === 'Combo' ) {
          if ( !result[nodeName].subModules ) {
            result[nodeName].subModules = {};
          }
          itemResult = result[nodeName].subModules;
        } else if ( ( nodeName === 'head' || nodeName === 'body' || nodeName === 'summary' ) &&
          ( node.parentNode.parentNode.nodeName === 'Grid' ||
          ( node.parentNode.nodeName === 'format' && node.parentNode.parentNode.parentNode.nodeName === 'Grid' ) ) ) {
          if ( !result[nodeName].subModules ) {
            result[nodeName].subModules = {};
          }
          itemResult = result[nodeName].subModules;
        } else {
          itemResult = result;
        }
        nodes = node.childNodes;
        for ( i = 0; i < nodes.length; i++ ) {
          storeData( nodes[i], itemResult );
        }
      }
    }
  }
};

var collectUsage = function(list) {
  var result = {};

  list.forEach( function( file, idx ) {
    console.log( idx + ' ' + file );

    var doc,
        nodes,
        content = fs.readFileSync( file );

    content = iconv_lite.decode( content, 'CP949' );
    doc = new domParser().parseFromString(content);
    nodes = doc.childNodes;

    var i;

    for ( i = 0; i < nodes.length; i++ ) {
      storeData( nodes[i], result );
    }
  } );

  return result;
};

var getFileList = function( dir, done ) {
  var results = [];
  fs.readdir( dir, function( err, list ) {
    if (err) {
      return done(err);
    }

    var pending = list.length;
    if ( !pending ) {
      return done( null, results );
    }

    list.forEach( function(file) {
      file = path.resolve( dir, file );
      fs.stat( file, function( err, stat ) {
        if ( stat && stat.isDirectory() ) {
          getFileList( file, function( err, res ) {
            push.apply( results, res );
            if ( !--pending ) done( null, results );
          } );
        } else {
          if ( file.lastIndexOf( '.xml' ) > 1 ) {
            results.push(file);
          } else {
            console.log( 'Omit ' + file );
          }
          if ( !--pending) done( null, results );
        }
      } );
    } );
  } );
};

var sortData = function (data) {
  var result;

  var keys = _.keys(data);
  console.log(keys);

  result = _.map( keys, function ( d ) {
    var obj = data[d];
    obj.type = d;

    if ( obj.subModules ) {
      obj.subModules = sortData( obj.subModules );
      obj.subModules = _.sortBy( obj.subModules, 'count' );
    }

    if ( obj.attrs ) {
      obj.attrs = _.reduce( obj.attrs, function ( memo, d, k ) {
        memo.push( {
          'attr': k,
          'count': d
        });
        return memo;
      }, [] );

      obj.attrs = _.sortBy( obj.attrs, 'count' );
    }

    return obj;
  } );

  return _.sortBy( result, 'count' );
};

getFileList( targetDir, function( err, list ) {
  var data,
      sortedData;

  if ( err ) {
    console.error( err );
  }

  data = collectUsage(list);

  var s = '{"Window":{"count":88},"Form":{"count":88,"attrs":{"BKColor":86,"Height":88,"Id":88,"Left":88,"OnLoadCompleted":71,"PidAttrib":88,"scroll":42,"Style":23,"Title":88,"Top":88,"Ver":88,"Width":88,"WorkArea":88,"Font":38,"OnUnloadCompleted":1,"OnCloseUp":1}},"Div":{"count":470,"attrs":{"Height":470,"Id":470,"Left":462,"Style":298,"TabOrder":470,"Top":470,"Width":470,"Text":191,"BKColor":102,"Visible":4,"TabStop":1,"OnMouseDown":1}},"Contents":{"count":485},"Button":{"count":902,"attrs":{"Align":262,"ButtonStyle":346,"Cursor":783,"DefaultButton":4,"Height":902,"Id":902,"ImageID":902,"Left":902,"LeftMargin":265,"OnClick":572,"Style":342,"TabOrder":902,"Text":832,"Top":890,"Width":902,"ToolTipText":341,"Enable":136,"Transparent":3,"TabStop":33,"TopMargin":83,"Visible":5,"OnKeyDown":10}},"Shape":{"count":149,"attrs":{"Bottom":149,"Height":149,"Id":149,"Left":149,"LineColor":149,"LineKind":137,"Right":149,"TabOrder":149,"Top":149,"Width":149,"RoundUnit":2,"RoundHeight":2,"LineWidth":11,"BKColor":2}},"Edit":{"count":866,"attrs":{"BindDataset":99,"Column":144,"Height":866,"Id":866,"Left":866,"LeftMargin":850,"MaxLength":185,"OnChanged":110,"OnKeyDown":178,"RightMargin":850,"Style":862,"TabOrder":866,"Top":865,"Width":866,"ImeMode":132,"UpperOnly":6,"Number":94,"OnCharChanged":50,"Readonly":73,"Text":492,"Align":50,"AutoSelect":11,"AutoSkip":9,"Enable":432,"Border":323,"UserData":40,"BKColor":52,"Font":11,"DisableBKColor":20,"UseIME":3,"Visible":2,"TabStop":9,"Color":4,"OnFocus":8,"CheckLength":2,"OnKillFocus":9,"BorderColor":14,"Face3dColor":4,"InputPanel":61,"DisableColor":8,"Hilight3dColor":3}},"Combo":{"count":396,"attrs":{"BindDataset":32,"CodeColumn":254,"Column":28,"DataColumn":360,"DisplayRowCnt":254,"Height":396,"Id":396,"INDEX":77,"InnerDataset":359,"Left":396,"OnChanged":74,"Style":396,"TabOrder":396,"Top":396,"Value":34,"Width":396,"BKColor":6,"Enable":20,"Text":205,"UserData":2,"Font":35,"Editable":10,"OnKeyDown":21,"OnCloseUp":4,"ImeMode":1,"Search":1,"ResetIndex":97,"UseIME":1,"Border":6,"Color":3},"subModules":{"Contents":{"count":3},"Record":{"count":6,"attrs":{"Code":6,"Data":6}}}},"Static":{"count":1409,"attrs":{"Align":1194,"Height":1409,"Id":1409,"Left":1359,"Style":1315,"TabOrder":1409,"Text":1407,"Top":1396,"VAlign":1330,"Width":1409,"Font":104,"BKColor":30,"Color":532,"BindDataset":5,"Border":2,"ShadowColor":2,"Type":2,"Enable":1,"Visible":1,"Hilight3dColor":4,"WordWrap":7}},"Grid":{"count":191,"attrs":{"AutoEnter":107,"BindDataset":191,"BkColor2":191,"BkSelColor":191,"BoldHead":191,"Border":191,"Bottom":191,"ColSizing":187,"Editable":137,"Enable":191,"EndLineColor":191,"FillArea":191,"HeadHeight":191,"Height":191,"Id":191,"InputPanel":191,"Left":189,"LineColor":191,"OnExpandEdit":23,"OnKeyDown":42,"Right":191,"RowHeight":191,"SelColor":152,"Style":191,"TabOrder":191,"TabStop":191,"Top":191,"UseDBuff":191,"UseSelColor":191,"Visible":191,"VLineColor":191,"Width":191,"BKColor":2,"FillAreaType":98,"NoDataText":2,"OnCellClick":23,"OnHeadClick":111,"OnCellDBLClick":28,"OnScrollLast":66,"OnTrackLast":1,"AutoFit":132,"MinWidth":133,"ScrollCell":42,"Format":7,"OnEnterDown":12,"AutoScrollBar":7,"OnCellPosChanged":36,"AreaSelect":51,"OnNoDataAreaClick":21,"MultiSelect":15,"ColSelect":7,"OnMouseOut":4,"OnMouseOver":4,"BorderColor":22,"HeadBorder":2},"subModules":{"contents":{"count":191},"columns":{"count":200},"col":{"count":2349,"attrs":{"fix":340,"width":2349}},"head":{"count":200,"subModules":{"cell":{"count":2420,"attrs":{"col":2420,"color":664,"colspan":304,"display":2420,"text":2332,"align":1244,"expandsize":6,"rowspan":71,"row":435,"expandcolor":1,"bkcolor":273,"wordwrap":59,"displaymaskchar":1,"button3d":15,"expandimage":1,"expr":5,"celltype":31}}}},"body":{"count":198,"subModules":{"cell":{"count":2310,"attrs":{"align":1903,"celltype":194,"col":2310,"color":321,"display":2309,"expr":227,"font":221,"text":73,"bkcolor":1249,"colid":2097,"edit":400,"combocol":99,"combodataset":103,"combotext":127,"expandimage":129,"expandshow":87,"expandsize":124,"limit":92,"Mask":50,"bkcolor2":845,"imemode":16,"useime":18,"combodisplaynltext":9,"colspan":12,"multiline":18,"combodisplayrowcnt":7,"expandchar":16,"expandcolor":3,"cursor":1,"checklength":2,"bkimagealign":15,"expandfont":1}}}},"format":{"count":18,"attrs":{"id":18}}}},"MaskEdit":{"count":276,"attrs":{"ClipMode":230,"Enable":260,"Height":276,"Id":276,"Left":240,"LeftMargin":242,"RightMargin":242,"Style":276,"TabOrder":276,"Width":276,"Value":72,"Column":37,"BindDataset":36,"MaxLength":8,"Top":254,"Mask":27,"Readonly":9,"Type":14,"Cursor":12,"BKColor":1,"OnChanged":1,"TabStop":8}},"Image":{"count":266,"attrs":{"Align":246,"Height":266,"Id":266,"ImageID":266,"LeftMargin":249,"Style":261,"TabOrder":266,"TabStop":23,"Text":249,"Top":247,"Width":266,"Font":8,"Transparent":6,"FillType":12,"Left":159,"Hilight3dColor":12}},"Calendar":{"count":88,"attrs":{"BackColorColumn":51,"ClickedBkColor":79,"ClickedTextColor":82,"DateColumn":51,"DisplayMaskChar":46,"Height":88,"Id":88,"InnerDataset":52,"Left":88,"LeftMargin":40,"NullValue":81,"RightMargin":40,"SaturdayTextColor":88,"Style":88,"SundayTextColor":88,"TabOrder":88,"TextColorColumn":51,"Top":88,"UseTrailingDay":51,"Value":16,"Width":88,"Dateformat":17,"OnChanged":9,"OnKeyDown":18,"Enable":7,"BindDataset":10,"Column":17,"TabStop":1,"Border":7,"DaySelect":1,"DayStyle":1,"BKColor":6,"DayFont":6}},"Tab":{"count":15,"attrs":{"Height":15,"Id":15,"Left":13,"OnChanged":4,"Style":13,"TabIndex":4,"TabOrder":15,"Top":14,"Width":15,"SelectFont":11,"FixedFont":2,"Font":2,"Border":2}},"TabPage":{"count":38,"attrs":{"Height":38,"Id":38,"Left":38,"TabOrder":38,"Text":38,"Top":38,"Width":38,"Font":3}},"TextArea":{"count":69,"attrs":{"BindDataset":27,"Column":29,"Height":69,"Id":69,"Left":69,"TabOrder":69,"Top":69,"Width":69,"ImeMode":40,"MaxLength":43,"Style":68,"VScroll":67,"Readonly":8,"Enable":16,"CheckLength":29,"Color":2,"Text":20,"BKColor":9,"Border":18,"BorderColor":7}},"Radio":{"count":16,"attrs":{"BindDataset":1,"Border":16,"Height":16,"Id":16,"INDEX":16,"Left":16,"OnChanged":6,"Style":16,"TabOrder":16,"Top":16,"Value":13,"Width":16,"Enable":4,"Appearance":3,"ColumnCount":5,"DataColumn":5,"InnerDataset":5,"UserData":5,"BKColor":2,"Color":2,"DisableBKColor":2},"subModules":{"contents":{"count":11},"Layout":{"count":22,"attrs":{"code":22,"height":22,"left":22,"text":22,"top":22,"width":22}},"Contents":{"count":2},"colinfo":{"count":4,"attrs":{"Id":4,"Size":4,"Type":4}},"record":{"count":8},"code":{"count":8},"value":{"count":8}}},"Checkbox":{"count":46,"attrs":{"FalseValue":4,"Height":46,"Id":46,"Left":46,"LeftMargin":42,"OnClick":6,"Style":42,"TabOrder":46,"Text":42,"Top":46,"TrueValue":4,"Value":30,"Width":46,"Font":1,"TabStop":1,"Appearance":24,"DisableBKColor":5,"DisableColor":4,"Enable":7,"BindDataset":1,"Column":1,"Color":5}},"Progressbar":{"count":1,"attrs":{"Height":1,"Id":1,"Left":1,"Max":1,"Origin":1,"Step":1,"TabOrder":1,"Top":1,"Width":1}},"button":{"count":2,"attrs":{"BKColor":2,"ButtonStyle":2,"Color":2,"Height":2,"Id":2,"ImageID":2,"Left":2,"OnClick":2,"Style":2,"TabOrder":2,"Text":2,"Top":2,"Width":2}}}';
  data = JSON.parse(s);
  console.log( JSON.stringify(data) );

  sortedData = sortData(data);
  console.log( JSON.stringify(sortedData) );
} );
