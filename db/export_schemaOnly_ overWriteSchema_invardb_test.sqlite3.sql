BEGIN TRANSACTION;
DROP TABLE IF EXISTS "tblSaleOrder";
CREATE TABLE IF NOT EXISTS "tblSaleOrder" (
	"saloSaleOrderId"	INTEGER NOT NULL UNIQUE,
	"saloSaleOrderNumber"	INTEGER NOT NULL,
	"saloSaleOrderDate"	INTEGER NOT NULL,
	"saloSaleOrderAmountSubTotal"	REAL,
	"saloSaleOrderVATax"	REAL,
	"saloSaleOrderOtherTaxes"	INTEGER,
	"saloSaleOrderAmountTotal"	REAL,
	"saloSaleOrderConfirmationDate"	INTEGER DEFAULT 0,
	"saloCurrencyId"	INTEGER,
	"saloCustomerId"	INTEGER,
	"saloEmployeeId"	INTEGER,
	"saloStatusId"	INTEGER,
	"saloTermsId"	INTEGER,
	"saloSaleOrderRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"saloSaleOrderRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"saloSaleOrderRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("saloSaleOrderId"),
	FOREIGN KEY("saloCustomerId") REFERENCES "tblCustomer"("cusCustomerId")
);
DROP TABLE IF EXISTS "tblInventoryIndexCardTransaction";
CREATE TABLE IF NOT EXISTS "tblInventoryIndexCardTransaction" (
	"invtInventoryTransactionId"	INTEGER NOT NULL UNIQUE,
	"invtInventoryTransactionUnitQuantity"	INTEGER,
	"invtInventoryTransactionType"	INTEGER,
	"invtInventoryTransactionDescription"	TEXT,
	"invtInventoryIndexCardId"	INTEGER,
	"invtPurchaseOrderId"	INTEGER,
	"invtSaleOrderId"	INTEGER,
	"invtWarehouseSlotId"	INTEGER,
	"invtInventoryTransactionRowDateCreated"	INTEGER DEFAULT CURRENT_TIMESTAMP,
	"invtInventoryTransactionRowDateUpdated"	INTEGER DEFAULT 0,
	"invtInventoryTransactionRowDateDeleted"	INTEGER DEFAULT 0,
	PRIMARY KEY("invtInventoryTransactionId")
);
DROP TABLE IF EXISTS "tblProduct";
CREATE TABLE IF NOT EXISTS "tblProduct" (
	"prdProductId"	INTEGER NOT NULL UNIQUE,
	"prdProductCode"	TEXT,
	"prdProductName"	TEXT,
	"prdProductDetail"	BLOB,
	"prdProductBrand"	TEXT,
	"prdProductModel"	TEXT,
	"prdProductCategory"	TEXT,
	"prdProductManufacturer"	TEXT,
	"prdProductInitialUnitQuantity"	INTEGER,
	"prdProductQuantityPerUnit"	INTEGER DEFAULT 1,
	"prdProductUnitPurchasePrice"	REAL NOT NULL DEFAULT 0,
	"prdCurrencyId"	INTEGER NOT NULL DEFAULT 459,
	"prdProductRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"prdProductRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"prdProductRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("prdCurrencyId") REFERENCES "pltblCurrency"("plCurrencyId"),
	PRIMARY KEY("prdProductId")
);
DROP TABLE IF EXISTS "tblInventoryIndexCard";
CREATE TABLE IF NOT EXISTS "tblInventoryIndexCard" (
	"invInventoryIndexCardId"	INTEGER NOT NULL UNIQUE,
	"invInventoryIndexCardPartNumber"	INTEGER,
	"invInventoryIndexCardName"	TEXT,
	"invInventoryMinimumStock"	INTEGER,
	"invInventoryMaximumStock"	INTEGER,
	"invInventoryQuantityBalance"	INTEGER,
	"invInventoryMethod"	INTEGER DEFAULT 0,
	"invInventoryIndexCardCreationDate"	INTEGER,
	"invInventoryLastTransactionDate"	INTEGER DEFAULT 1,
	"invProductId"	INTEGER,
	"invStatusId"	INTEGER DEFAULT 0,
	"invInventoryRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"invInventoryRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"invInventoryRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("invProductId") REFERENCES "tblProduct"("prdProductId"),
	PRIMARY KEY("invInventoryIndexCardId")
);
DROP TABLE IF EXISTS "tblCustomer";
CREATE TABLE IF NOT EXISTS "tblCustomer" (
	"cusCustomerId"	INTEGER NOT NULL UNIQUE,
	"cusCustomerName"	TEXT NOT NULL,
	"cusCustomerCUIT"	TEXT,
	"cusCustomerAddress"	TEXT,
	"cusCustomerEmail"	TEXT,
	"cusCustomerPhone1"	TEXT,
	"cusCustomerContact"	TEXT,
	"cusCustomerContactPhone1"	TEXT,
	"cusCheckingAccountId"	INTEGER,
	"cusLocalityId"	INTEGER,
	"cusRegionId"	INTEGER,
	"cusSalesRepId"	INTEGER,
	"cusCustomerRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"cusCustomerRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"cusCustomerRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("cusCheckingAccountId") REFERENCES "tblCheckingAccount"("cacCheckingAccountId"),
	FOREIGN KEY("cusRegionId") REFERENCES "pltblRegion"("plRegionId"),
	FOREIGN KEY("cusLocalityId") REFERENCES "pltblLocality"("plLocalityId"),
	PRIMARY KEY("cusCustomerId")
);
DROP TABLE IF EXISTS "tblCheckingAccount";
CREATE TABLE IF NOT EXISTS "tblCheckingAccount" (
	"cacCheckingAccountId"	INTEGER NOT NULL UNIQUE,
	"cacCheckingAccountName"	TEXT,
	"cacCheckingAccountBalance"	REAL DEFAULT 0,
	"cacCheckingAccountLastTransactionDate"	INTEGER,
	"cacCurrencyId"	INTEGER,
	"cacCheckingAccountRowDateCreated"	INTEGER DEFAULT CURRENT_TIMESTAMP,
	"cacCheckingAccountRowDateUpdated"	INTEGER DEFAULT 0,
	"cacCheckingAccountRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("cacCurrencyId") REFERENCES "pltblCurrency"("plCurrencyId"),
	PRIMARY KEY("cacCheckingAccountId")
);
DROP TABLE IF EXISTS "pltblCurrency";
CREATE TABLE IF NOT EXISTS "pltblCurrency" (
	"plCurrencyId"	INTEGER NOT NULL UNIQUE,
	"plCurrencyCode"	TEXT,
	"plCurrencyNumericCode"	TEXT,
	"plCurrencyName"	TEXT,
	"plCurrencyLiteral"	TEXT,
	"plCurrencySymbol"	BLOB,
	"plCurrencyRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plCurrencyRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"plCurrencyRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plCurrencyId")
);
DROP TABLE IF EXISTS "linkProductWarehouseSlot";
CREATE TABLE IF NOT EXISTS "linkProductWarehouseSlot" (
	"lnkProductWarehouseSlotId"	INTEGER NOT NULL,
	"lnkProductWarehouseProductId"	INTEGER NOT NULL,
	"lnkProductWarehouseWarehouseSlotId"	INTEGER NOT NULL,
	"lnkProductWarehouseSlotStockQuantity"	INTEGER NOT NULL DEFAULT 0,
	"lnkProductWarehouseSlotRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkProductWarehouseSlotRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkProductWarehouseSlotRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	UNIQUE("lnkProductWarehouseProductId","lnkProductWarehouseWarehouseSlotId"),
	FOREIGN KEY("lnkProductWarehouseProductId") REFERENCES "tblProduct"("prdProductId"),
	PRIMARY KEY("lnkProductWarehouseSlotId")
);
DROP TABLE IF EXISTS "linkProductSupplier";
CREATE TABLE IF NOT EXISTS "linkProductSupplier" (
	"lnkProductSupplierId"	INTEGER NOT NULL UNIQUE,
	"lnkProductSupplierProdcutId"	INTEGER NOT NULL,
	"lnkProductSupplierSupplierId"	INTEGER NOT NULL,
	"lnkProductSupplierRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkProductSupplierRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkProductSupplierRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("lnkProductSupplierProdcutId") REFERENCES "tblProduct"("prdProductId"),
	UNIQUE("lnkProductSupplierProdcutId","lnkProductSupplierSupplierId"),
	FOREIGN KEY("lnkProductSupplierSupplierId") REFERENCES "tblSupplier"("suppSupplierId"),
	PRIMARY KEY("lnkProductSupplierId")
);
DROP TABLE IF EXISTS "linkProductPriceList";
CREATE TABLE IF NOT EXISTS "linkProductPriceList" (
	"lnkProductPriceListId"	INTEGER NOT NULL UNIQUE,
	"lnkProductPriceListPriceListId"	INTEGER NOT NULL,
	"lnkProductPriceListProductId"	INTEGER NOT NULL,
	"lnkProductPriceListMarkUp"	REAL,
	"lnkProductPriceListSellPrice"	REAL DEFAULT 0,
	"lnkProductPriceListNetPrice"	REAL DEFAULT 0,
	"lnkProductPriceListRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkProductPriceListRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkProductPriceListRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("lnkProductPriceListPriceListId") REFERENCES "tblPriceList"("plisPriceListId"),
	UNIQUE("lnkProductPriceListPriceListId","lnkProductPriceListProductId","lnkProductPriceListRowDateDeleted"),
	FOREIGN KEY("lnkProductPriceListProductId") REFERENCES "tblProduct"("prdProductId"),
	PRIMARY KEY("lnkProductPriceListId")
);
DROP TABLE IF EXISTS "linkPaymentMethodSaleOrder";
CREATE TABLE IF NOT EXISTS "linkPaymentMethodSaleOrder" (
	"lnkPayMethodSaleOrderId"	INTEGER NOT NULL UNIQUE,
	"lnkPayMethodSaleOrderPaymentMethodId"	INTEGER NOT NULL,
	"lnkPayMethodSaleOrderSaleOrderId"	INTEGER NOT NULL,
	"lnkPayMethodSaleOrderRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkPayMethodSaleOrderRowdateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkPayMethodSaleOrderRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("lnkPayMethodSaleOrderPaymentMethodId") REFERENCES "pltblPaymentMethod"("plPaymentMethodId"),
	UNIQUE("lnkPayMethodSaleOrderSaleOrderId","lnkPayMethodSaleOrderPaymentMethodId"),
	PRIMARY KEY("lnkPayMethodSaleOrderId")
);
DROP TABLE IF EXISTS "linkInventoryWharehouseSlot";
CREATE TABLE IF NOT EXISTS "linkInventoryWharehouseSlot" (
	"lnkInventoryWarehouseSlotId"	INTEGER NOT NULL UNIQUE,
	"lnkInventoryWarehouseSlotWarehouseSlotId"	INTEGER NOT NULL,
	"lnkInventoryWarehouseSlotInventoryIndexCardId"	INTEGER NOT NULL,
	"lnkInventoryWarehouseSlotRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkInventoryWarehouseSlorRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkInventoryWarehouseSlotRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("lnkInventoryWarehouseSlotWarehouseSlotId") REFERENCES "tblWarehouseSlot"("slotWarehouseSlotId"),
	UNIQUE("lnkInventoryWarehouseSlotInventoryIndexCardId","lnkInventoryWarehouseSlotWarehouseSlotId"),
	FOREIGN KEY("lnkInventoryWarehouseSlotInventoryIndexCardId") REFERENCES "tblInventoryIndexCard"("invInventoryIndexCardId"),
	PRIMARY KEY("lnkInventoryWarehouseSlotId")
);
DROP TABLE IF EXISTS "linkProductSaleOrder";
CREATE TABLE IF NOT EXISTS "linkProductSaleOrder" (
	"lnkProductSaleOrderId"	INTEGER NOT NULL UNIQUE,
	"lnkProductSaleOrderSaleOrderId"	INTEGER NOT NULL,
	"lnkProductSaleOrderProductId"	INTEGER NOT NULL,
	"lnkProductSaleOrderQuantity"	INTEGER NOT NULL,
	"lnkProductSaleOrderUnitTypeId"	INTEGER,
	"lnkProductSaleOrderUnitSellPrice"	REAL DEFAULT 0,
	"lnkProductSaleOrderDiscount"	REAL,
	"lnkProductSaleOrderSubTotal"	REAL NOT NULL,
	"lnkProductSaleOrderVATax"	REAL,
	"lnkProductSaleOrderSubTotalWithVATax"	REAL,
	"lnkProductSaleOrderRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lnkProductSaleOrderRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"lnkProductSaleOrderRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	UNIQUE("lnkProductSaleOrderSaleOrderId","lnkProductSaleOrderProductId","lnkProductSaleOrderRowDateDeleted"),
	FOREIGN KEY("lnkProductSaleOrderProductId") REFERENCES "tblProduct"("prdProductId"),
	PRIMARY KEY("lnkProductSaleOrderId")
);
DROP TABLE IF EXISTS "tblPriceList";
CREATE TABLE IF NOT EXISTS "tblPriceList" (
	"plisPriceListId"	INTEGER NOT NULL UNIQUE,
	"plisPriceListCode"	TEXT,
	"plisPriceListName"	TEXT,
	"plisPriceListMarkup"	REAL DEFAULT 1,
	"plisPriceListDollarLinked"	INTEGER DEFAULT 0,
	"plisPriceListModifiedDate"	INTEGER,
	"plisCurrencyId"	INTEGER,
	"plisExchangeRateId"	INTEGER,
	"plisPriceListRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plisPriceListRowDateUpdated"	INTEGER NOT NULL DEFAULT 0,
	"plisPriceListRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("plisCurrencyId") REFERENCES "pltblCurrency"("plCurrencyId"),
	FOREIGN KEY("plisExchangeRateId") REFERENCES "pltblExchangeRate"("plExchangeRateId"),
	PRIMARY KEY("plisPriceListId")
);
DROP TABLE IF EXISTS "tblPurchaseOrder";
CREATE TABLE IF NOT EXISTS "tblPurchaseOrder" (
	"puroPurchaseOrderId"	INTEGER NOT NULL UNIQUE,
	"puroPurchaseOrderNumber"	TEXT,
	"puroPurchaseOrderDateRequested"	INTEGER,
	"puroPurchaseOrderDateReceived"	INTEGER,
	"puroPurchaseOrderTotalCost"	INTEGER,
	"puroSupplierId"	INTEGER,
	"puroPurchaseOrderRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"puroPurchaseOrderRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"puroPurchaseOrderRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("puroPurchaseOrderId")
);
DROP TABLE IF EXISTS "tblWarehouseSlot";
CREATE TABLE IF NOT EXISTS "tblWarehouseSlot" (
	"slotWarehouseSlotId"	INTEGER NOT NULL UNIQUE,
	"slotWarehouseSlotCode"	TEXT UNIQUE,
	"slotWarehouseSlotDescription"	TEXT,
	"slotWarehouseSlotWidth"	INTEGER,
	"slotWarehouseSlotLength"	INTEGER,
	"slotWarehouseSlotHeigth"	INTEGER,
	"slotWarehouseAreaId"	INTEGER NOT NULL,
	"slotWarehouseSlotRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"slotWarehouseSlotRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"slotWarehouseSlotRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("slotWarehouseSlotId")
);
DROP TABLE IF EXISTS "tblWarehouseArea";
CREATE TABLE IF NOT EXISTS "tblWarehouseArea" (
	"areaWarehouseAreaId"	INTEGER NOT NULL UNIQUE,
	"areaWarehouseAreaCode"	INTEGER,
	"areaWarehouseAreaName"	INTEGER,
	"areaWarehouseAreaDescription"	TEXT,
	"areaWarehouseId"	INTEGER,
	"areaWarehouseAreaRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"areaWarehouseAreaRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"areaWarehouseAreaRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("areaWarehouseAreaId")
);
DROP TABLE IF EXISTS "tblWarehouse";
CREATE TABLE IF NOT EXISTS "tblWarehouse" (
	"wrhWarehouseId"	INTEGER NOT NULL UNIQUE,
	"wrhWarehouseCode"	TEXT,
	"wrhWarehouseName"	TEXT,
	"wrhWarehouseDescription"	TEXT,
	"wrhWarehouseAddress"	TEXT,
	"wrhWarehouseRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"wrhWarehouseRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"wrhWarehouseRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("wrhWarehouseId")
);
DROP TABLE IF EXISTS "tblUser";
CREATE TABLE IF NOT EXISTS "tblUser" (
	"usrUserId"	INTEGER NOT NULL UNIQUE,
	"usrUserName"	TEXT,
	"usrUserEmail"	TEXT,
	"usrUserPassword"	INTEGER,
	"usrUserActiveYes"	INTEGER DEFAULT 1,
	"usrUserResetPassword"	INTEGER DEFAULT 0,
	"usrEmployeeId"	INTEGER,
	"usrRoleId"	INTEGER,
	"usrUserRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"usrUserRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"usrUserRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("usrUserId"),
	FOREIGN KEY("usrEmployeeId") REFERENCES "tblEmployee"("empEmployeeId")
);
DROP TABLE IF EXISTS "tblSupplier";
CREATE TABLE IF NOT EXISTS "tblSupplier" (
	"suppSupplierId"	INTEGER NOT NULL UNIQUE,
	"suppSupplierName"	TEXT,
	"suppSupplierCode"	TEXT,
	"suppSupplierRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"suppSupplierRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"suppSupplierRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("suppSupplierId")
);
DROP TABLE IF EXISTS "tblQuoteDetail";
CREATE TABLE IF NOT EXISTS "tblQuoteDetail" (
	"qtedQuoteDetailId"	INTEGER NOT NULL UNIQUE,
	"qtedQuoteId"	INTEGER,
	"qtedProductId"	INTEGER,
	"qtedQuoteDetailRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"qtedQuoteDetailRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"qtedQuoteDetailRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("qtedQuoteDetailId")
);
DROP TABLE IF EXISTS "tblQuote";
CREATE TABLE IF NOT EXISTS "tblQuote" (
	"qteQuoteId"	INTEGER NOT NULL UNIQUE,
	"qteQuoteDate"	INTEGER,
	"qteCustomerId"	INTEGER,
	"qteQuoteRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"qteQuoteRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"qteQuoteRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("qteQuoteId")
);
DROP TABLE IF EXISTS "tblPurchaseOrderDetail";
CREATE TABLE IF NOT EXISTS "tblPurchaseOrderDetail" (
	"purodPurchaseOrderDetailId"	INTEGER NOT NULL UNIQUE,
	"purodPurchaseOrderDetailQuantityOrdered"	INTEGER,
	"purodPurchaseOrderDetailQuantityReceived"	INTEGER,
	"purodPurchaseOrderDetailUnitCost"	INTEGER,
	"purodPurchaseOrderDetailRowDateCreated"	INTEGER,
	"purodPurchaseOrderDetailRowDateUpdated"	INTEGER,
	"purodPurchaseOrderDetailRowDateDeleted"	INTEGER,
	PRIMARY KEY("purodPurchaseOrderDetailId")
);
DROP TABLE IF EXISTS "tblEmployee";
CREATE TABLE IF NOT EXISTS "tblEmployee" (
	"empEmployeeId"	INTEGER NOT NULL UNIQUE,
	"empEmployeeAddress"	TEXT,
	"empEmployeeDNI"	TEXT,
	"empEmployeeEmail"	TEXT,
	"empEmployeeFirstName"	TEXT,
	"empEmployeeFullName"	TEXT,
	"empEmployeeLastName"	TEXT,
	"empEmployeePhone1"	TEXT,
	"empCountryId"	INTEGER,
	"empLocalityId"	INTEGER,
	"empPriceListId"	INTEGER,
	"empRegionId"	INTEGER,
	"empEmployeeRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"empEmployeeRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"empEmployeeRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("empEmployeeId"),
	FOREIGN KEY("empLocalityId") REFERENCES "pltblLocality"("plLocalityId"),
	FOREIGN KEY("empRegionId") REFERENCES "pltblRegion"("plRegionId"),
	FOREIGN KEY("empPriceListId") REFERENCES "tblPriceList"("plisPriceListId")
);
DROP TABLE IF EXISTS "tblCheckAccTransaction";
CREATE TABLE IF NOT EXISTS "tblCheckAccTransaction" (
	"catCheckAccTransactionId"	INTEGER NOT NULL UNIQUE,
	"catCheckAccTransactionAmount"	REAL DEFAULT 0,
	"catCheckAccTransactionType"	INTEGER DEFAULT 0,
	"catCheckAccTransactionDescription"	TEXT NOT NULL,
	"catCheckingAccountId"	INTEGER,
	"catPaymentMethodId"	INTEGER,
	"catCheckAccTransactionRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"catCheckAccTransactionRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"catCheckAccTransactionRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("catCheckAccTransactionId"),
	FOREIGN KEY("catCheckingAccountId") REFERENCES "tblCheckingAccount"("cacCheckingAccountId")
);
DROP TABLE IF EXISTS "pltblStatus";
CREATE TABLE IF NOT EXISTS "pltblStatus" (
	"plStatusId"	INTEGER NOT NULL UNIQUE,
	"plStatusCode"	INTEGER,
	"plStatusName"	TEXT UNIQUE,
	"plStatusGroup"	TEXT,
	"plStatusRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plStatusRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plStatusRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plStatusId")
);
DROP TABLE IF EXISTS "pltblRole";
CREATE TABLE IF NOT EXISTS "pltblRole" (
	"plRoleId"	INTEGER NOT NULL UNIQUE,
	"plRoleName"	TEXT NOT NULL,
	"plRoleCreatePrivilege"	INTEGER NOT NULL,
	"plRoleReadPrivilege"	INTEGER NOT NULL,
	"plRoleUpdatePrivilege"	INTEGER NOT NULL,
	"plRoleDeletePrivilege"	INTEGER NOT NULL,
	"plRoleRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plRoleRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plRoleRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plRoleId")
);
DROP TABLE IF EXISTS "pltblRegion";
CREATE TABLE IF NOT EXISTS "pltblRegion" (
	"plRegionId"	INTEGER NOT NULL UNIQUE,
	"plRegionName"	TEXT,
	"plRegionRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plRegionRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plRegionRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plRegionId")
);
DROP TABLE IF EXISTS "pltblPaymentMethod";
CREATE TABLE IF NOT EXISTS "pltblPaymentMethod" (
	"plPaymentMethodId"	INTEGER NOT NULL UNIQUE,
	"plPaymentMethodType"	TEXT,
	"plPaymentMethodRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plPaymentMethodRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plPaymentMethodRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plPaymentMethodId")
);
DROP TABLE IF EXISTS "pltblExchangeRate";
CREATE TABLE IF NOT EXISTS "pltblExchangeRate" (
	"plExchangeRateId"	INTEGER NOT NULL DEFAULT 1 UNIQUE,
	"plExchangeRateRate"	REAL,
	"plExchangeRateFromCurrencyId"	INTEGER,
	"plExchangeRateToCurrencyId"	INTEGER,
	"plExchangeRateRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plExchangeRateRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plExchangeRateRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plExchangeRateId"),
	FOREIGN KEY("plExchangeRateFromCurrencyId") REFERENCES "pltblCurrency"("plCurrencyId"),
	FOREIGN KEY("plExchangeRateToCurrencyId") REFERENCES "pltblCurrency"("plCurrencyId")
);
DROP TABLE IF EXISTS "pltblLocality";
CREATE TABLE IF NOT EXISTS "pltblLocality" (
	"plLocalityId"	INTEGER NOT NULL UNIQUE,
	"plLocalityName"	TEXT,
	"plLocalityDepartmentId"	INTEGER,
	"plLocalityTownId"	INTEGER,
	"plLocalityProvinceId"	INTEGER,
	"plLocalityRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plLocalityRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plLocalityRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY("plLocalityProvinceId") REFERENCES "pltblProvince"("plProvinceId"),
	FOREIGN KEY("plLocalityDepartmentId") REFERENCES "pltblDepartment"("plDepartmentId"),
	FOREIGN KEY("plLocalityTownId") REFERENCES "pltblTown"("plTownId"),
	PRIMARY KEY("plLocalityId")
);
DROP TABLE IF EXISTS "tblSaleOrderDoc";
CREATE TABLE IF NOT EXISTS "tblSaleOrderDoc" (
	"sodSaleOrderDocId"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"sodSaleOrderDocNumber"	INTEGER,
	"sodSaleOrderDocType"	INTEGER,
	"sodSaleOrderDocDetail"	INTEGER,
	"sodSaleOrderId"	INTEGER,
	"sodQuoteId"	INTEGER,
	"sodSaleOrderDocRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"sodSaleOrderDocRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"sodSaleOrderDocRowDateDeleted"	INTEGER NOT NULL DEFAULT 0
);
DROP TABLE IF EXISTS "pltblTown";
CREATE TABLE IF NOT EXISTS "pltblTown" (
	"plTownId"	INTEGER NOT NULL UNIQUE,
	"plTownName"	TEXT,
	"plTownFullName"	TEXT,
	"plTownProvinceId"	INTEGER,
	"plTownRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plTownRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plTownRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plTownId")
);
DROP TABLE IF EXISTS "pltblProvince";
CREATE TABLE IF NOT EXISTS "pltblProvince" (
	"plProvinceId"	INTEGER NOT NULL UNIQUE,
	"plProvinceName"	TEXT,
	"plProvinceFullName"	TEXT,
	"plProvinceRegionId"	INTEGER,
	"plProvinceIso_id"	TEXT,
	"plProvinceIso_nombre"	TEXT,
	"plProvinceRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plProvinceRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plProvinceRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plProvinceId")
);
DROP TABLE IF EXISTS "pltblDepartment";
CREATE TABLE IF NOT EXISTS "pltblDepartment" (
	"plDepartmentId"	INTEGER NOT NULL UNIQUE,
	"plDepartmentName"	TEXT,
	"plDepartmentFullName"	TEXT,
	"plDepartmentProvinceId"	INTEGER,
	"plDepartmentRowDateCreated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plDepartmentRowDateUpdated"	INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"plDepartmentRowDateDeleted"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("plDepartmentId")
);
DROP INDEX IF EXISTS "InventoryIndexCardTransactionPK";
CREATE INDEX IF NOT EXISTS "InventoryIndexCardTransactionPK" ON "tblInventoryIndexCardTransaction" (
	"invtInventoryTransactionId"	ASC,
	"invtInventoryIndexCardId"	ASC,
	"invtSaleOrderId"	ASC,
	"invtInventoryTransactionRowDateDeleted"	ASC
);
DROP INDEX IF EXISTS "ProductPriceListPK";
CREATE INDEX IF NOT EXISTS "ProductPriceListPK" ON "linkProductPriceList" (
	"lnkProductPriceListId"	ASC,
	"lnkProductPriceListProductId"	ASC,
	"lnkProductPriceListRowDateDeleted"	ASC
);
DROP INDEX IF EXISTS "ProductPK";
CREATE UNIQUE INDEX IF NOT EXISTS "ProductPK" ON "tblProduct" (
	"prdProductId"	ASC,
	"prdProductCode"	ASC,
	"prdProductRowDateDeleted"
);
DROP INDEX IF EXISTS "ProductSaleOrderPK";
CREATE INDEX IF NOT EXISTS "ProductSaleOrderPK" ON "linkProductSaleOrder" (
	"lnkProductSaleOrderId"	ASC,
	"lnkProductSaleOrderRowDateDeleted"
);
DROP INDEX IF EXISTS "LocalityPK";
CREATE INDEX IF NOT EXISTS "LocalityPK" ON "pltblLocality" (
	"plLocalityId"	ASC,
	"plLocalityName"	ASC,
	"plLocalityRowDateDeleted"
);
COMMIT;
