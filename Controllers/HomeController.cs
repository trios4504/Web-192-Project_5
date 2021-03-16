using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingCart.Models;

namespace ShoppingCart.Controllers
{
    public class HomeController : Controller
    {
        private static Dictionary<string, List<Product>> productLists = new Dictionary<string, List<Product>>();
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Register(string UserInput, string PasswordInput)
        {
            string result = $"The user is: {UserInput} and the password is {PasswordInput}";

            return Content(result);
        }

        public JsonResult GetProducts()
        {
            Product product1 = new Product();
            product1.ProductId = 1;
            product1.ProductName = "Squirtle";
            product1.Description = "Funko figure of Squirtle from Pokemon";
            product1.Price = 25;
            product1.ImageName = "Squirtle.jpg";

            Product product2 = new Product();
            product2.ProductId = 2;
            product2.ProductName = "Raizel";
            product2.Description = "Raizel Chibi figure from Noblesse";
            product2.Price = 50;
            product2.ImageName = "Raizel.jpg";

            Product product3 = new Product();
            product3.ProductId = 3;
            product3.ProductName = "Alucard";
            product3.Description = "Alucard action figure from Hellsing";
            product3.Price = 120;
            product3.ImageName = "Alucard.jpg";

            IList<Product> productList = new List<Product>();
            productList.Add(product1);
            productList.Add(product2);
            productList.Add(product3);

            return Json(productList);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public bool AddIntoList(string listName, Product newProduct)
        {
            List<Product> existingList = null;

            bool exists = productLists.ContainsKey(listName);
            if(exists)
            {
                existingList = productLists[listName];
            }
            else
            {
                existingList = new List<Product>();
            }

            List<Product> result = existingList.Where(product => product.ProductId == newProduct.ProductId).ToList();
            bool productWasAdded = false;

            if(result.Count==0)
            {
                existingList.Add(newProduct);
                productWasAdded = true;
                productLists[listName] = existingList;
            }

            return productWasAdded;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
