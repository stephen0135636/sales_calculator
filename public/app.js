var dataController = (function(){
  
  var Dailysales = function(id,description,value,quantity,unit){
    this.id = id;
    this.description = description;
    this.value = value
    this.quantity = quantity
    this.unit  = unit
  };

  var Transfer = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Creditsales = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Creditpaymentcash = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Creditpaymentcash = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Creditpaymenttransfer = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems : {
      sales : [],
      transfer : [],
      credit: [],
      credit_payment_cash: [],
      credit_payment_transfer : [],
      exp: []
    },
    totals :{
      sales : 0,
      transfer : 0,
      credit:0,
      credit_payment_cash:0,
      credit_payment_transfer : 0,
      exp : 0
    },
    overall: 0,    
  };

  var calculateTotal  = function(type){
    var sum = 0;

    data.allItems[type].forEach(function(cur){
      sum  += cur.value;
    });
    data.totals[type] = sum;
  }
  
  return {
    addItem : function(type,des,val,qty,unit){
      var newItem,ID

      //creating new ID
      if(data.allItems[type].length  > 0 ){ 
        ID = data.allItems[type][data.allItems[type].length - 1].id +1;
      }else{
        ID = 0;
      }

      // create new item based on inc or exp
      if(type === 'sales'){
        val = qty * val
        newItem = new Dailysales(ID,des,val,qty,unit);
      }else if(type === 'transfer'){
        newItem = new Transfer(ID,des,val);
      }else if(type === 'credit'){
        newItem = new Creditsales(ID,des,val);
      }else if(type === 'credit_payment_cash'){
        newItem = new Creditpaymentcash(ID,des,val);
      }else if(type === 'credit_payment_transfer'){
        newItem = new Creditpaymenttransfer(ID,des,val);
      }else if(type === 'exp'){
        newItem = new Expense(ID,des,val);
      }
      //push it into our data Structure
      data.allItems[type].push(newItem);

      //return the new data Structure
      return newItem;

    },
    deleteItem : function(type,id){
      var ids, index;
      ids = data.allItems[type].map(function(current){
        return current.id;
      });
      index = ids.indexOf(id)
  
      if(index !== -1){
        data.allItems[type].splice(index,1)
      }
    },
    calculateTotals  : function(){
      //1. calculate the total income and expense
      calculateTotal('sales');
      calculateTotal('transfer');
      calculateTotal('credit');
      calculateTotal('credit_payment_cash');
      calculateTotal('credit_payment_transfer');
      calculateTotal('exp');
  
      //2. calculate the budget : income - expense
      data.overall =  data.totals.sales - data.totals.transfer - data.totals.credit + data.totals.credit_payment_cash - data.totals.credit_payment_transfer - data.totals.exp
    },
    getTotals : function(){
      return{
        totals : data.overall,
        totalSales : data.totals.sales,
        totalTransfer : data.totals.transfer,
        totalCredit : data.totals.credit,
        total_creditPay_cash : data.totals.credit_payment_cash,
        total_creditPay_transfer : data.totals.credit_payment_transfer,
        totalExp: data.totals.exp,
      }
    },
    testing : function(){
      console.log(data)
    }
  }

})();

//UICONTROLLER
var UIController  = (function(){

  var DomStrings = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputQuantity: '.add__quantity',
    inputUnit : '.add__unit',
    inputValue : '.add__value',
    inputBtn : '.add__btn',
    salesContainer : '.sales__list',
    transferContainer : '.transfer__list',
    credit_salesContainer : '.credit_sales__list',
    credit_payment_cashContainer : '.credit_payment-cash__list',
    credit_payment_transferContainer : '.credit_payment-transfer__list',
    expenseContainer : '.expenses__list',
    Cash_at_handLabel : '.budget__value',
    DailySalesLabel : '.daily_sales--value',
    BottomDailySalesLabel : '#dailySales_bottom_part',
    TransferLabel : '.transfer--value',
    creditLabel :'.credit_sales--value',
    credit_payment_cash : '.credit_payment-cash--value',
    credit_payment_transfer : '.credit_payment-transfer--value',
    expenseLabel: '.expenses_total--value',
    bottomExpenseLabel : '#expense_bottom_part',
    container : '.row',
    datelabel : '.date',
    add_bottom : '.add__container'
  }

  var formatNumber = function(num){
    num = Math.abs(num);

    num = num.toFixed(0)

    if(num.length > 3){
     num = num.substr(0,num.length - 3)+ ',' + num.substr(num.length-3,3);
    }

    return num
 }

 var nodeListForEach = function(list,callback){
  for(i = 0 ;  i <list.length ;i++ ){
    callback(list[i],i)
  }
}


  return {
    getInput: function(){
      return{
        type : document.querySelector(DomStrings.inputType).value,
        description : document.querySelector(DomStrings.inputDescription).value,
        quantity : parseFloat(document.querySelector(DomStrings.inputQuantity).value),
        unit : document.querySelector(DomStrings.inputUnit).value,
        value : parseFloat(document.querySelector(DomStrings.inputValue).value),
      }
    },
    addListItems: function(obj,type){
      var html,newHtml,element;
  
      if(type == 'sales'){
        html = '<div class="item clearfix  tooltipHover" id="sales-%id%"><div class="tooltip"><div class="tooltiptext"><div class="item__description">%description-tooltip%</div>  %quantity% <span>%unit%<span> <div class="right"><div class="item__value">%value-main%</div></div></div></div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"> <i class="fa fa-close"> </i></button></div></div></div>'
        element = DomStrings.salesContainer
      }else if(type == 'transfer'){
        html =  '<div class="item clearfix" id="transfer-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-close"></i></button></div></div></div>';
        element = DomStrings.transferContainer
      }else if(type == 'credit'){
        html = '<div class="item clearfix" id="credit-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-close"></i></button></div></div></div>'
        element = DomStrings.credit_salesContainer
      }else if(type == 'credit_payment_cash'){
        html = '<div class="item clearfix" id="credit_payment_cash-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-close"></i></button></div></div></div>'
        element = DomStrings.credit_payment_cashContainer
      }else if(type == 'credit_payment_transfer'){
        html = '<div class="item clearfix" id="credit_payment_transfer-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-close"></i></button></div></div></div>'
        element = DomStrings.credit_payment_transferContainer
      }else if(type == 'exp'){
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-close"></i></button></div></div></div>'
        element = DomStrings.expenseContainer
      }
  
      newHtml = html.replace('%id%',obj.id)
      newHtml = newHtml.replace('%description%',obj.description)
      newHtml = newHtml.replace('%description-tooltip%',obj.description)
      newHtml = newHtml.replace('%quantity%',obj.quantity)
      newHtml = newHtml.replace('%unit%',obj.unit)
      newHtml = newHtml.replace('%value-main%',formatNumber(obj.value/obj.quantity))
      newHtml = newHtml.replace('%value%',formatNumber(obj.value))
  
      document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
    },
    deleteListItem : function(selectorID){
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el)
    },
    clearFields : function(type){
      var fields,fieldsArr
      if(type == 'sales'){
        fields = document.querySelectorAll(DomStrings.inputDescription + ' , ' + DomStrings.inputValue + ',' + DomStrings.inputQuantity + ',' + DomStrings.inputUnit)
        
        fieldsArr = Array.prototype.slice.call(fields)
      
        fieldsArr.forEach(function(current, index, array){
          current.value = "";
        });
    
        fieldsArr[0].focus()

      }

      fields = document.querySelectorAll(DomStrings.inputDescription + ' , ' + DomStrings.inputValue)
        
      fieldsArr = Array.prototype.slice.call(fields)
    
      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });
  
      fieldsArr[0].focus()      

    },
    displayCash : function(obj){
      // var type;
      // obj.budget > 0 ? type  = 'inc' : type = 'exp'
      document.querySelector(DomStrings.Cash_at_handLabel).textContent = formatNumber(obj.totals);
      document.querySelector(DomStrings.DailySalesLabel).textContent = formatNumber(obj.totalSales);
      document.querySelector(DomStrings.BottomDailySalesLabel).textContent = formatNumber(obj.totalSales);
      document.querySelector(DomStrings.TransferLabel).textContent = formatNumber(obj.totalTransfer);
      document.querySelector(DomStrings.creditLabel).textContent = formatNumber(obj.totalCredit);
      document.querySelector(DomStrings.credit_payment_cash).textContent = formatNumber(obj.total_creditPay_cash);
      document.querySelector(DomStrings.credit_payment_transfer).textContent = formatNumber(obj.total_creditPay_transfer);
      document.querySelector(DomStrings.expenseLabel).textContent = formatNumber(obj.totalExp);
      document.querySelector(DomStrings.bottomExpenseLabel).textContent = formatNumber(obj.totalExp)
    
    },
    changeType : function(type){
      if(type == 'sales'){
        document.querySelector(DomStrings.inputQuantity).style.display  = 'inline-block';
        document.querySelector(DomStrings.inputUnit).style.display  = 'inline-block';
      }else{
        document.querySelector(DomStrings.inputQuantity).style.display  = 'none';
        document.querySelector(DomStrings.inputUnit).style.display  = 'none';
      }
    },
    ForwardBtn : function(type){
      var forms,formsArr
      if(type == 'sales'){
        forms = document.querySelectorAll(DomStrings.inputDescription + ' , ' + DomStrings.inputQuantity + ',' + DomStrings.inputUnit + ',' + DomStrings.inputValue)
        formsArr = Array.prototype.slice.call(forms)
      
        formsArr[1].focus()

        if(formsArr[0].value){
          formsArr[1].focus();
        }

        if(formsArr[1].value){
          formsArr[2].focus();
        }

        if(formsArr[2].value){
          formsArr[3].focus()
        }
      }else{
        forms = document.querySelectorAll(DomStrings.inputDescription + ' , ' +DomStrings.inputValue)
        formsArr = Array.prototype.slice.call(forms)
      
        formsArr[1].focus()
      }
    },
    BackWardbtn : function(type){
      /*
      var forms,formsArr
      if(type == 'sales'){
        forms = document.querySelectorAll(DomStrings.inputDescription + ' , ' + DomStrings.inputQuantity + ',' + DomStrings.inputUnit + ',' + DomStrings.inputValue)
        formsArr = Array.prototype.slice.call(forms)
      

        if(formsArr[3].value !==  ''){
          formsArr[1].focus();
        }

        if(formsArr[1].value){
          formsArr[2].focus();
        }

        if(formsArr[2].value){
          formsArr[3].focus()
        }
        


        // if(formsArr[2].value){
        //   formsArr[1].focus();
        // }

        // if(formsArr[1].value){
        //   formsArr[0].focus()
        // }
      }*/
    },
    displayMonth: function(){
      var now, year,month,months,day,days
      now = new Date();
      year  = now.getFullYear();
      months = ['january','february','March','April','may','June','July','August','September','October','November','December']
      month = now.getMonth();
      day = now.getDate()
      document.querySelector(DomStrings.datelabel).textContent = day+'-'+ months[month]+'-'+ year
    },
    getDomStrings : function(){
      return DomStrings
    }

  }

})();

//CONTROLLER

var controller = (function(dataCtrl,UICtrl){

  var setupEventListener = function(){
    var Dom = UICtrl.getDomStrings()
    document.querySelector(Dom.inputBtn).addEventListener('click',ctrlAddItem)

    document.addEventListener('keypress',function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    })

    /*forward key*/
    document.addEventListener('keyup',function(event){
      if(event.keyCode === 39 || event.which === 39){
        var changeFocusForward = UICtrl.getInput().type
        UICtrl.ForwardBtn(changeFocusForward)
      }  

    })

    /*backard key*/

    document.addEventListener('keyup',function(event){
       if(event.keyCode === 37 || event.which === 37){
        var changeFocusBackward = UICtrl.getInput().type
        UICtrl.BackWardbtn(changeFocusBackward)
      }
    })
    document.querySelector(Dom.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(Dom.inputType).addEventListener('change',ctrlChangeType)
  }
  
  var ctrlAddItem = function(){
    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){      
      
      //2. Add the item to the budget controller
      newItem = dataCtrl.addItem(input.type, input.description, input.value,input.quantity,input.unit)

      //3. add the item to the UI
      UICtrl.addListItems(newItem, input.type)

      //4. clear the fields
      UICtrl.clearFields(input.type)

      //5. Calculate and update budget
      updateBudget()

    }
  };

  var ctrlDeleteItem = function(event){
    var itemID,splitID,type,ID
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

    if(itemID){
      splitID = itemID.split('-')

      type = splitID[0];
      ID = parseInt(splitID[1])
      
      //1. delete the item from the data stucture
      dataCtrl.deleteItem(type,ID)

      //2. delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // //3. update and show the new budget
      updateBudget()

    }
  };

  var ctrlChangeType = function(){
    var getType =  UICtrl.getInput()

    // console.log(getType.type)
    UICtrl.changeType(getType.type)
  }

  var updateBudget = function(){
    //.1 calculate the budget
    dataCtrl.calculateTotals()

    //2. return the budget
    var salesMonitor = dataCtrl.getTotals()

    UICtrl.displayCash(salesMonitor)
  }
  return {
    init : function(){
      UICtrl.displayMonth()
      UICtrl.displayCash({
        totals : 0,
        totalSales : 0,
        totalTransfer: 0,
        totalCredit : 0,
        total_creditPay_cash : 0,
        total_creditPay_transfer : 0,
        totalExp : 0
      })
      console.log('Application has started')
      setupEventListener()
    }
  }
})(dataController,UIController);

controller.init()