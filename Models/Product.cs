using System;
namespace ShoppingCart.Models
{
    public class Product
    {
        public Product()
        {
        }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string ImageName { get; set; }
        public decimal Price { get; set; }
    }
}
