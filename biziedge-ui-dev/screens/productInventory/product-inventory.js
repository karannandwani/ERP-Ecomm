class ProductInventory {
  actualLots; //: Lots[];
  suggestedLots; //: Lots[] = [];
  _noOfCase = 0;
  _noOfProduct = 0;
  noOfActualCases = 0;
  noOfActualProducts = 0;
  forcedLotId;

  set noOfCase(noOfCase) {
    //: number
    this._noOfCase = noOfCase;
    this.recalculate();
  }

  get noOfCase() {
    return this._noOfCase;
  }

  set noOfProduct(noOfProduct) {
    //: number
    this._noOfProduct = noOfProduct;
    this.recalculate();
  }

  get noOfProduct() {
    return this._noOfProduct;
  }

  recalculate() {
    this.suggestedLots = [];
    this.noOfActualCases = 0;
    this.noOfActualProducts = 0;
    // Calculate and set suggestedLots

    const sortedLots =
      this.actualLots && this.actualLots.length > 0
        ? [
            ...(this.forcedLotId
              ? [this.actualLots.find((x) => x._id === this.forcedLotId)]
              : []),
            ...this.actualLots
              .filter((x) => x._id != this.forcedLotId)
              .sort(
                (a, b) =>
                  a.procurementDate.getDate() - b.procurementDate.getDate()
              )
              .map((x) => ({ ...x })),
          ]
        : [];
    // Assign Cases to the lots
    for (const lot of sortedLots) {
      if (
        this.noOfActualCases === this.noOfCase &&
        this.noOfActualProducts === this.noOfProduct
      ) {
        break;
      }
      // Assign Cases
      const assignableCases = Math.min(
        lot.forcedNoOfCases != undefined ? lot.forcedNoOfCases : lot.noOfCase,
        this.noOfCase - this.noOfActualCases
      );
      lot.noOfCase = lot.actualNoOfCase - assignableCases;
      this.noOfActualCases += assignableCases;
      lot.allocatedcase = assignableCases;
      // Asign Products
      const assignableProducts = Math.min(
        lot.forcedNoOfProducts != undefined
          ? lot.forcedNoOfProducts
          : lot.noOfProduct,
        this.noOfProduct - this.noOfActualProducts
      );
      if (lot.forcedNoOfProducts > lot.noOfProduct) {
        const prodAvailInLot = lot.noOfCase * lot.qtyPerCase + lot.noOfProduct;
        const assignableQtyInLot = Math.min(
          lot.forcedNoOfProducts - this.noOfActualProducts,
          prodAvailInLot
        );
        // const avail = prodAvailInLot - lot.forcedNoOfProducts;
        const noOfCasesBroken = Math.ceil(
          (assignableQtyInLot - lot.noOfProduct) / lot.qtyPerCase
        );
        lot.noOfCasesToBeOpened = noOfCasesBroken;
        lot.noOfCase = lot.noOfCase - noOfCasesBroken;
        lot.noOfProduct =
          noOfCasesBroken * lot.qtyPerCase -
          (assignableQtyInLot - lot.noOfProduct);
        this.noOfActualProducts += assignableQtyInLot;
        lot.allocatedProduct = assignableQtyInLot;
      } else {
        lot.noOfProduct = lot.actualNoOfProduct - assignableProducts;
        this.noOfActualProducts += assignableProducts;
        lot.allocatedProduct = assignableProducts;
      }
      // check if this lot is used, push to suggested lots
      if (assignableCases > 0 || assignableProducts > 0)
        this.suggestedLots.push(lot);
    }

    // Break Cases in case products are still needed.
    if (this.noOfActualProducts < this.noOfProduct) {
      for (const lot of sortedLots.filter((l) => l.noOfCase > 0)) {
        const prodAvailInLot = lot.noOfCase * lot.qtyPerCase;
        const assignableQtyInLot = Math.min(
          this.noOfProduct - this.noOfActualProducts,
          prodAvailInLot
        );

        lot.noOfCasesToBeOpened = Math.ceil(
          assignableQtyInLot / lot.qtyPerCase
        );
        lot.noOfCase = lot.noOfCase - lot.noOfCasesToBeOpened;
        lot.noOfProduct +=
          lot.noOfCasesToBeOpened * lot.qtyPerCase - assignableQtyInLot;
        this.noOfActualProducts += assignableQtyInLot;
        lot.allocatedProduct += assignableQtyInLot;

        if (!this.suggestedLots.some((l) => l._id === lot._id)) {
          this.suggestedLots.push(lot);
        }
        if (this.noOfActualProducts === this.noOfProduct) {
          break;
        }
      }
    }
  }

  validate() {
    // return true if lot and actual products matches, else return false
    return true;
  }
}
class Lots {
  noOfCase; //: number;
  noOfProduct; //: number;
  allocatedcase; //: number;
  allocatedProduct; //: number;
  noOfCasesToBeOpened; //: number = 0;
  procurementDate; //: Date;
  _id; //: String;
  costPrice; //: number;
  wholesalePrice; //: number;
  retailPrice; //: number;
  mrp; //: number;
  supplierLotId; //: String;
  forcedNoOfCases; //: number = undefined;
  forcedNoOfProducts; //: number = undefined;
  qtyPerCase; //: number;
}

export default ProductInventory;
