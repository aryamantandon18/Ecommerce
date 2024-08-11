router.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
  
    const products = await Product.aggregate([
      { $match: { published: true, slug: slug } },
  
      {
        $lookup: {
          from: "reviews",
          let: { currentProductId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", { $toString: "$$currentProductId" }] },
                    { $eq: ["$published", true] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "reviews",
        },
      },
  
      {
        $addFields: {
          ratingSum: {
            $reduce: {
              initialValue: 0,
              input: "$reviews",
              in: { $sum: ["$$value", "$$this.rate"] },
            },
          },
        },
      },
      {
        $addFields: {
          reviewsAverageRate: {
            $cond: [
              { $eq: ["$ratingSum", 0] },
              0,
              { $divide: ["$ratingSum", { $size: "$reviews" }] },
            ],
          },
        },
      },
    ]);
  
    let product;
  
    // if the product not found return 404, not 400,
    // on the client we need to redirect to 404.
    // not found.
    if (products && products.length) {
      product = products[0];
    } else {
      res.status(404).send("Product not found.");
      return;
    }
  
    res.status(200).send(product);
  });