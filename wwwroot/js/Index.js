var productList = {};
var shoppingCart = [];
var existingProducts = {};
var dataTable = null;

$(document).ready(function () {
    var loginButton = document.createElement("button");
    $(loginButton).text("Log In");

    var registerButton = document.createElement("button");
    $(registerButton).text("Register");

    var divContainer = $("nav.navbar div.container");

    $(divContainer).append(loginButton);
    $(divContainer).append(registerButton);

    $(loginButton).click(function () {
        alert("you have logged in");
    });

    $(registerButton).click(function () {
        $("#RegisterDialog").dialog("open");
    });

    $("#RegisterDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Cancel": function () {
                $("#dialog").dialog("close");
            }
        }
    });

    $("form[name='registration']").validate({
        rules: {
            UserInput: "required",
            PasswordInput: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            UserInput: "Please add a User name",
            PasswordInput: {
                required: "The password is required",
                minlength: "The length has to be at least 5 characters"
            }
        },
        submitHandler: function (form) {
            var userValue = $("#UserInput").val();
            var passwordValue = $("#PasswordInput").val();

            var result;

            $.when(
                $.ajax({
                    type: "POST",
                    url: "/Home/Register",
                    async: true,
                    datatype: "json",
                    data: {
                        UserInput: userValue,
                        PasswordInput: passwordValue
                    }
                })).then(function (data) {
                    result = data;

                    alert(result);
                });
        }
    });

    var productTableBody = $("#MainProductTable tbody");

    $.when($.ajax({
        type: "GET",
        url: "/Home/GetProducts",
        async: true,
        datatype: "json"
    })).then(function (data) {
        var mainData = [];
        var dataTableRow = [];
        var html = "";
        var product = null;

        for (var index = 0; index < data.length; index++) {
            dataTableRow = [];
            product = data[index];
            productList[product.productId] = product;

            html = $("<img />").attr("src", "/images/" + product.imageName).prop("outerHTML");
            html += $("<br>").prop("outerHTML");
            html += $("<label></label>").text(product.productName).prop("outerHTML");
            dataTableRow.push(html);

            dataTableRow.push(product.description);
            dataTableRow.push("$" + product.price);

            
            html = $("<i></i>").attr("data-id", product.productId).addClass("fas fa-arrow-circle-right AddIcons").prop("outerHTML");
            html += $("<br>").prop("outerHTML");
            html += $("<i></i>").attr("data-id", product.productId).addClass("fas fa-angle-double-right AddToListIcons").prop("outerHTML");
            dataTableRow.push(html);

            mainData.push(dataTableRow);
        }

        dataTable = $("#MainProductTable").DataTable({
            data: mainData
        });
    });

    $(productTableBody).on("click", ".AddIcons", function () {
        var productId = $(this).data("id");
        var newProduct = productList[productId];

        if (existingProducts[productId]) {
            existingProducts[productId].Quantity++;
        } else {
            var selectedProduct = new Product();
            selectedProduct.ProductId = newProduct.productId;
            selectedProduct.ProductName = newProduct.productName;
            selectedProduct.Description = newProduct.description;
            selectedProduct.ImageName = newProduct.imageName;
            selectedProduct.Price = newProduct.price;
            selectedProduct.Quantity = 1;

            shoppingCart.push(selectedProduct);

            existingProducts[productId] = selectedProduct;
        }

        console.log(shoppingCart);

        $.toast({
            heading: "Success",
            text: "Product " + newProduct.productName + " was added into the cart, " +
                " Quantity: " + existingProducts[productId].Quantity,
            icon: "success",
            showHideTransition: "plain",
            loaderBg: "red",
            stack: 2,
            bgColor: "#0f9b0f",
            textColor: 'white',
            position: "top-right"
        });
    });

    $(productTableBody).on("click", ".AddToListIcons", function () {
        var productId = $(this).data("id");
        $("#BuyFirstList").attr("data-id", productId);
        $("#BuyLastList").attr("data-id", productId);
        $("#ChristmasGiftsList").attr("data-id", productId);

        $("#dialog").dialog("open");
    });

    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Cancel": function () {
                $("#dialog").dialog("close");
            }
        }
    });

    $("#BuyFirstList").click(function () {
        var productId = $(this).data("id");

        AddToLists(this.checked, "Buy First", productId);
    });

    $("#BuyLastList").click(function () {
        var productId = $(this).data("id");

        AddToLists(this.checked, "Buy Last"), productId;
    });

    $("#ChristmasGiftsList").click(function () {
        var productId = $(this).data("id");

        AddToLists(this.checked, "Christmas Gifts", productId);
    });
});

function AddToLists(checkboxIsChecked, listName, productId) {
    var newProduct = productList[productId];
    var text = "";
    var loadgerBg = "";

    if (checkboxIsChecked) {
        text = "You have added the product into the " + listName + " List";
        loadgerBg = "blue";
    } else {
        text = "You have removed the product from the " + listName + " List";
        loadgerBg = "red";
    }

    $.when($.ajax({
        type: "POST",
        url: "/Home/AddIntoList",
        data: {
            listName: listName,
            newProduct: newProduct
        },
        async: true
    })).then(function (data) {
        var toastMessage = "";
        var bgColor = "";
        var heading = "";

        if (data == true) {
            toastMessage = "Product " + newProduct.productName + " was added into the " + listName + " list";
            bgColor = "#0f9b0f";
            heading = "Succes";
        } else {
            toastMessage = "Product " + newProduct.productName + " already existed on the list";
            bgColor = "red";
            heading = "Error";
        }

        $.toast({
            heading: heading,
            text: toastMessage,
            icon: "success",
            showHideTransition: "plain",
            loaderBg: loadgerBg,
            stack: 2,
            bgColor: bgColor,
            textColor: 'white',
            position: "top-right"
        });
    });
}