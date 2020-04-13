new Vue({
	el: '#app',
	data: {
		products: [],
		/*		prod: [
		       mobile = {
		    		   name : "Apple",
		    		   productPrice : 84340.00,
		    		   model : "iPhoneX",
		    		   quantity:0
		       },
		       laptop = {
		    		   name : "Dell",
		    		   productPrice : 70840.00,
		    		   model : "New Inspiron 13 7380 Laptop",
		    		   quantity:0
		       },
		       refrigerator = {
		    		   name : "Samsung",
		    		   productPrice : 16290.00,
		    		   model : "192 L Direct Cool Single Door 5 Star",
		    		   quantity:0
		       },],*/
		user: {
			userName: '',
			pass: '',    		

		},
		cart: {
			customerEmail: '',
			customerAddress: '',
			items: []    		

		},
		/*orderImage : {
		    	   "Apple" : 'https://rukminim1.flixcart.com/image/312/312/j7ksia80/mobile/t/4/f/apple-iphone-8-plus-mq8g2hn-a-original-imaexsfhxepbngdq.jpeg?q=70',
		    	   "Dell" : 'https://rukminim1.flixcart.com/image/312/312/jms25jk0/computer/m/z/3/dell-na-laptop-original-imaf9hu6z8yczyqv.jpeg?q=70',
		    	   "Samsung" : 'https://rukminim1.flixcart.com/image/312/312/jr0y9ow0/refrigerator-new/r/k/j/rr20r182xu8-hl-5-samsung-original-imafcp6v6hgqztkg.jpeg?q=70'
		       },*/
		arrImg :[],
		rowData:{
			"0":{},"1":{},"2":{}

		},
		checkedCategories:[],
		customerEmail : '',
		customerAddress : '',
		searchProduct: '',
		searchOrderId:'',
		searchProductName:'',
		order: {
			items: [],
		},
		productName:{},
		getlistoforders: {},
		orderStatus: {},
		bIsShow : false,
		isChecked:false,		

	},
	/*	created : function()
	{
		this.fetchProducts();
	},*/
	methods: {
		fetchProducts: function() {
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
			$.ajax({
				url: '/ui/api/catalog-service/api/products'
			})
			.done(function(data) {
				this.products = data;
			}.bind(this));
		},
		
		
		login : function () {
			if(this.user.username == '' || this.user.password == ''){
				$('.errorMsg').html("Please provide the credentials.");
				$('.errorMsg').show();
			}/*else {
				$('.a-section').hide();
				$('#toggle, #Prodropdown, #styleImg').show();
				this.cart.customerEmail = this.user.userName;
				this.fetchProducts();
			}*/
			else {
				this.fetchProducts();
				var dtaa  = {'username':this.user.username,'password':this.user.password,'grant_type':'password'};
				this.cart.customerEmail = this.user.username;
				this.cart.customerAddress = "Sonata Software Ltd. Global Village-560059";
				$.ajax({
					type: 'POST',
					url: '/ui/api/oauth-service/oauth/token/',
					contentType : 'application/x-www-form-urlencoded',
					headers: {"Authorization": "Basic YWRtaW46cGFzc3dvcmQ="}, //  for admin and password Auth
					data: dtaa,
					
					  success: function(data, textStatus, request){
						    				
							$('.a-section, #placeOrder,#getAll, #table1, #table2, #toggle ,#table4,#searchproductName, #table3,#searchOrderID').hide();
							$('#blank').remove();
							$(' #Prodropdown, #styleImg, #loginid').show();
							//this.fetchProducts();
							
							//this.cart.customerEmail = this.user.username;
						  console.log(request.getResponseHeader('Authorization'));
						  sessionStorage.setItem("Authorization", 'Bearer '+data['access_token']);
				
						  sessionStorage.getItem('Authorization');
					       // alert(request.getResponseHeader('Authorization'));
					   },
					   error: function (jqXHR,status,err) {
						   $('.errorMsg').html(jqXHR.responseJSON.error_description+". Please provide the correct credentials.");
						   $('.errorMsg').show();
						  // alert(jqXHR.responseJSON.error_description+".");
					   }

				});
			}
			
			/*.done(function(data) {
				data.getResponseHaeder
				$('.errorMsg').show();
			}.bind(this));*/
			
		},
		
		addToCart: function () {
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
			var arr = [];
			this.checkedCategories.forEach(function (p) {
				arr.push({
					name: p.name,
					model: p.model,
					productPrice: p.price,
					imageurl: p.imageurl,
					quantity:p.quantity
				});
			});
			this.cart.items=arr;
		},
		check: function(e) {
			if (e.target.checked) {
				console.log(e.target.value)
			}
		},

		selectedValue : function(id){
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
			$("#prodTable, .pOrder,#toggle").show();
	
			//bIsShow = true;
			//this.product = this.prod[id];
			//this.product.imge =  this.products[this.prod[id].name];
			/*this.rowData.push(this.product);*/
			if(!this.rowData[id].name)
			{
				this.rowData[id] = {
						"name" : this.products[id].name,
						"model" : this.products[id].model,
						"price" : this.products[id].price,
						"quantity" : this.products[id].quantity,
						"imageurl":this.products[id].imageurl,
				}
			}

			for(var i = 0; i<=Object.keys(this.rowData).length; i++){			
				//if(this.rowData[i].name == undefined) delete this.rowData[i];
				if(this.rowData[i] && this.rowData[i].name== this.products[id].name)
				{

					this.rowData[id].quantity++;
				}
			}

		},
		placeOrder: function (event) {
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
			if(this.checkedCategories!="")
			{
				$('.errorMsgplaceorder').hide();

				this.addToCart();
				$('#toggle').toggle();
				var token =  sessionStorage.getItem('Authorization');
				$.ajax({
					type: 'POST',
					url: '/ui/api/order-service/api/orders',
					contentType : 'application/json',
					headers: {"Authorization": token},
					data: JSON.stringify(this.cart)

				})
				.done(function(data) {
					this.orderStatus = data;	
					//this.orderStatus.items = this.cart.items
					$("#styleImg").hide();
					$('#placeOrder,#getAll, #table1').show();
					this.rowData={
							"0":{},"1":{},"2":{}

					};
					this.checkedCategories =[];

				}.bind(this)).fail(function (jqXHR,status,err) {
					$('.errorMsgplaceorder').html(jqXHR.responseJSON.message+".");
					$('.errorMsgplaceorder').show();
					alert(jqXHR.responseJSON.message+".");
	  			});
			}
			else
			{
				$('.errorMsgplaceorder').show();
			}

		},

		searchOrderItems: function(){
			$('#placeOrder,#getAll, #table1, #table2, #toggle,#styleImg,#table4,#searchproductName').hide();
			$("#searchOrderID").show();
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
		},
		searchProductItems: function(){
			$('#placeOrder,#getAll, #table1, #table2, #toggle,#styleImg,#table3,#searchOrderID').hide();
			$("#searchproductName").show();
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
		},
		searchOrder: function () {
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchAll').hide();
			var token =  sessionStorage.getItem('Authorization');
			$.ajax({
				type: 'GET',
				url: '/ui/api/order-service/api/orders/'+this.searchOrderId,
				contentType : 'application/json',
				headers: {"Authorization": token}
			})
			.done(function(data) {
				$('#table3').show();
				this.order = data;
				if(this.order == null) {
					this.order= {
							items: [],
					};
				}
				console.log(data);
				//this.order.items = this.checkedCategories
			}.bind(this)).fail(function (jqXHR,status,err) {
				
				$('.errorMsgForSearchbyid').html(jqXHR.responseJSON.message+".");
				$('.errorMsgForSearchbyid').show();
			
  			});
		},
		searchProductByName: function () {
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			$('.errorMsgForSearchAll').hide();
			$.ajax({
				type: 'GET',
				url: '/ui/api/catalog-service/api/products/byname/'+this.searchProductName,
				contentType : 'application/json'
			})
			.done(function(data) {
				$('#table4').show();
				this.productName = data;
				console.log(data);
				//this.order.items = this.checkedCategories
			}.bind(this)).fail(function (jqXHR,status,err) {
				//alert(jqXHR.responseJSON.message+".");
				$('.errorMsgForSearchbyid').html(jqXHR.responseJSON.message+".");
				$('.errorMsgForSearchbyid').show();
  			});
		},

		searchAllOrdersClick: function () {
			$('#table3,#placeOrder,#getAll, #table1, #table2, #toggle,#styleImg, #searchOrderID, #searchproductName').hide();
			$('#table2').show();
			$('.errorMsgForSearchAll').hide();
			$('.errorMsgplaceorder').hide();
			$('.errorMsgForSearchbyid').hide();
			var token =  sessionStorage.getItem('Authorization');
			$.ajax({
				type: 'GET',
				url: '/ui/api/order-service/api/orders/all',
				contentType : 'application/json',
				headers: {"Authorization": token}
			})
			.done(function(data) {
				this.getlistoforders = data;
				$('#placeOrder, #getAll').hide();
			}.bind(this)).fail(function (jqXHR,status,err) {
				//alert(jqXHR.responseJSON.message+".");
				
				$('.errorMsgForSearchAll').html(jqXHR.responseJSON.message+".");
				$('.errorMsgForSearchAll').show();
	  	  		//console.log(jqXHR.responseJSON.error);
	  	  		//$('.errorMsg').append('A');
	  	  	//	$('.errorMsg').show();
	  	  			});

		}
	},
	computed: {

	}

});
