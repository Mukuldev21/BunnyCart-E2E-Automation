# detailed Test Cases: BunnyCart E2E

## Module 1: Authentication & User Management
**TC Range:** TC001 - TC010

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC001 | Registered User Login - Success | Critical | Functional, Smoke | User account exists | 1. Click "Sign In" link in header<br>2. Enter valid Email<br>3. Enter valid Password<br>4. Click "Sign In" button | - Redirected to Homepage or My Account<br>- "Welcome, [Name]" text visible in header<br>- "Sign Out" link available | Email: [ValidUser]<br>Pwd: [ValidPass] |
| TC002 | Login Failure - Invalid Password | High | Functional, Negative | User account exists | 1. Navigate to "Sign In" page<br>2. Enter valid Email<br>3. Enter INVALID Password<br>4. Click "Sign In" button | - Error message displayed: "The account sign-in was incorrect..."<br>- User stays on login page | Email: [ValidUser]<br>Pwd: invalid123 |
| TC003 | New User Registration - Success | Critical | Functional | Email is unique | 1. Click "Create an Account" link<br>2. Fill First Name, Last Name<br>3. Enter unique Email<br>4. Enter Password & Confirm Password<br>5. Click "Create an Account" | - Redirected to "My Account" page<br>- Success message: "Thank you for registering..."<br>- Account info matches input | Unique Email<br>Pass: Test@123 |
| TC004 | Forgot Password - Email Trigger | Medium | Functional | User exists | 1. Navigate to Sign In page<br>2. Click "Forgot Your Password?"<br>3. Enter registered Email<br>4. Click "Reset My Password" | - Success message displayed: "If there is an account associated with [email] you will receive an email..." | Email: [ValidUser] |
| TC005 | Login Validation - Empty Credentials | High | Functional, Negative | - | 1. Navigate to "Sign In" page<br>2. Leave Email and Password empty<br>3. Click "Sign In" | - "This is a required field." error under Email and Password<br>- User remains on page | - |
| TC006 | Sign Out Functionality | High | Functional | User is logged in | 1. Click dropdown/arrow next to User Name in header<br>2. Click "Sign Out" link | - Redirected to Homepage (usually after 5s)<br>- Header shows "Sign In" link again<br>- Session is terminated | - |
| TC007 | Password Validation Rules | Low | UI, Negative | - | 1. Navigate to Create Account<br>2. Enter weak password (e.g., "123")<br>3. Click Create Account | - Validation error under password field alerting requirements (min length, classes) | Pass: 123 |
| TC008 | Registration - Duplicate Email Validation | High | Functional, Negative | Email already registered | 1. Navigate to Create Account page<br>2. Enter an already registered Email<br>3. Fill other valid details<br>4. Click "Create an Account" | - Error message: "There is already an account with this email address."<br>- User remains on registration page | Email: [ValidUser] |
| TC009 | Login from Checkout (Guest -> User) | High | Functional | Guest with Item in Cart | 1. Go to Checkout<br>2. Click "Sign In" within Checkout UI<br>3. Enter credentials<br>4. Click Login | - User logged in without losing cart items<br>- Checkout step proceeds with pre-filled address (if any) | - |
| TC010 | Protected Route Redirection (Auth Guard) | High | Security, Functional | Logged Out | 1. Navigate to `/customer/account/` (Protected URL)<br>2. Verify Redirect to Login<br>3. Login with valid creds<br>4. Verify Redirect back to My Account | - Redirected to Login Page<br>- Redirected back to Protected Page after login | - |

## Module 2: Product Search & Browse
**TC Range:** TC011 - TC025

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC011 | Global Search - Valid Product | Critical | Functional | - | 1. Click Search bar in header<br>2. Type "Anubias"<br>3. Press Enter or Click Search Icon | - Search Results page loads<br>- Page title mentions "Search results for: 'Anubias'"<br>- Product grid contains "Anubias" items | Query: Anubias |
| TC012 | Global Search - No Results | Medium | Functional, Negative | - | 1. Click Search bar<br>2. Type "XylophoneFish"<br>3. Press Enter | - "Your search returned no results." message displayed<br>- No products listed | Query: XylophoneFish |
| TC013 | Category Navigation - Level 1 | High | Functional | - | 1. In Main Menu, click "Aquatic Plants" (or top level category) | - Category Page loads (PLP)<br>- Breadcrumb shows: Home > Aquatic Plants<br>- Products listed | Category: Aquatic Plants |
| TC014 | Filter Products by Price | Medium | Functional | On PLP with many items | 1. Expand "Shopping Options" if needed<br>2. Click a Price range (e.g., ₹0.00 - ₹999.00) | - URL updates with price parameter<br>- Filtered product list displays only items within range<br>- "Now Shopping by" shows Price filter | Filter: Price |
| TC015 | Sort Products by Name | Low | Functional | On PLP | 1. Click "Sort By" dropdown<br>2. Select "Product Name" | - Product list reorders alphabetically<br>- First item starts with A (or closest) | Sort: Name |
| TC016 | Product Listing - view Details | High | Functional | On PLP | 1. Click on a product Image or Name (e.g., "Java Moss") | - Redirected to Product Detail Page (PDP)<br>- URL contains product-slug | Product: Java Moss |
| TC017 | Pagination - Next Page | Medium | Functional | On PLP with >1 page | 1. Scroll to bottom<br>2. Click "Next" arrow or Page "2" | - URL updates (p=2)<br>- New set of products displayed<br>- "Page 2" is active in pager | - |
| TC018 | Sub-Category Navigation | Medium | Functional | - | 1. Hover "Aquatic Plants"<br>2. Click "Foreground" sub-category | - Foreground Category page loads<br>- Header title matches "Foreground" | Sub-cat: Foreground |
| TC019 | Filter Products by Color/Test | Low | Functional | On PLP | 1. Select a secondary filter (e.g., Difficulty/Light) | - Product list updates<br>- URL contains multiple filter params<br>- Filter count matches displayed items | - |
| TC020 | Clear All Filters | Medium | Functional | Filters applied | 1. Click "Clear All" in "Now Shopping by" section | - All filters removed<br>- Product list resets to default view<br>- URL params removed | - |
| TC021 | Verify Default Grid View | Low | UI | On PLP | 1. Navigate to Category | - Layout is Grid (.products-grid)<br>- Products displayed in columns | - |
| TC022 | Sort Products by Price (Low > High) | Medium | Functional | On PLP | 1. Sort By: Price<br>2. Direction: Ascending | - Cheapest products first<br>- Price strictly increasing | Sort: Price Asc |
| TC023 | Sort Products by Price (High > Low) | Medium | Functional | On PLP | 1. Sort By: Price<br>2. Direction: Descending | - Most expensive products first | Sort: Price Desc |
| TC024 | Change Items Per Page | Low | Functional | On PLP | 1. Select "24" or "36" from "Show" dropdown | - Page reloads<br>- Number of items matches selection (if inventory allows) | Show: 24 |
| TC025 | Breadcrumb Navigation Click | Medium | Navigation | On Sub-cat or PDP | 1. Click "Home" or Parent Category in breadcrumb | - Redirected to respective page<br>- Navigation path is valid | - |

## Module 3: Product Details (PDP)
**TC Range:** TC026 - TC035

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC026 | PDP Information Display | Critical | UI, Functional | - | 1. Navigate to PDP (e.g. "Anubias Nana Petite") | - Product Title visible<br>- Price visible and correct format<br>- Stock status (In Stock) visible<br>- SKU visible | Product: Anubias Nana |
| TC027 | Select Product Options | Critical | Functional | Product has options | 1. Locate "Type" or "Portion" option<br>2. Select "Net Pot"<br>3. Verify Price update (if applicable) | - Option is highlighted/selected<br>- "Add to Cart" button becomes active/clickable (if previously disabled) | Option: Net Pot |
| TC028 | Add to Cart - Success | Critical | SMOKE | Options selected | 1. Enter Qty: 1<br>2. Click "Add to Cart" | - Success message: "You added [Product] to your shopping cart."<br>- Mini-cart counter increases | Qty: 1 |
| TC029 | Add to Cart - Missing Option | Medium | Negative | Product has required options | 1. Deselect all options<br>2. Click "Add to Cart" | - Error message: "This is a required field." under the option<br>- Item NOT added to cart | - |
| TC030 | Product Image Gallery | Low | UI | - | 1. Click on thumbnail image | - Main product image updates to show selected thumbnail | - |
| TC031 | Out of Stock Product Display | High | Functional | Product OOS | 1. Navigate to OOS product page | - "Out of Stock" status displayed<br>- "Add to Cart" button is NOT visible or disabled | Product: OOS Item |
| TC032 | Update Quantity in PDP | Medium | Functional | - | 1. Change Qty input to 3<br>2. Click Add to Cart | - 3 items added to cart (verify in success msg or cart) | Qty: 3 |
| TC033 | Add to Wishlist | Low | Functional | Guest User | 1. Click "Add to Wish List" icon/link | - Redirected to Login page<br>- Message: "You must login or register to add items to your wishlist." | - |
| TC034 | Add to Compare | Low | Functional | - | 1. Click "Add to Compare" | - Success message: "You added product... to your comparison list."<br>- Comparison sidebar/bar appears | - |
| TC035 | Related Products (Upsell/Cross-sell) | Low | Navigation | PDP has related items | 1. Click a product in "Related Products" section | - Redirected to new PDP | - |

## Module 4: Shopping Cart
**TC Range:** TC036 - TC045

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC036 | Mini-Cart Hover/Click | High | Functional | Item in cart | 1. Hover/Click Cart icon in header | - Mini-cart dropdown appears<br>- Shows correct item count and subtotal<br>- "Go to Checkout" button visible | - |
| TC037 | View Cart Page | High | Functional | Item in cart | 1. Click Cart icon<br>2. Click "View and Edit Cart" | - Redirected to /checkout/cart/<br>- Item listed with details<br>- Subtotal matches item price | - |
| TC038 | Update Item Quantity | Medium | Functional | Item in cart | 1. On Cart page, change Qty from 1 to 2<br>2. Click "Update Shopping Cart" | - Page reloads/updates<br>- Subtotal doubles (approx)<br>- Success message may appear | Qty: 2 |
| TC039 | Remove Item from Cart | High | Functional | Item in cart | 1. Click Trash icon / "Remove item" | - Item removed from list<br>- "You have no items in your shopping cart" (if empty)<br>- Mini-cart count updates | - |
| TC040 | Proceed to Checkout | Critical | SMOKE | Item in cart | 1. Click "Proceed to Checkout" button | - Redirected to /checkout/#shipping<br>- Secure connection indicator | - |
| TC041 | Update Qty to Zero | Medium | Functional, Negative | - | 1. Change Qty to 0<br>2. Click Update | - Validation Error usually: "Please enter a quantity greater than 0" OR Item removed (depending on config) | Qty: 0 |
| TC042 | Apply Valid Discount Code **[SKIP - No valid code available]** | High | Functional | Valid code exists | 1. Expand "Apply Discount Code"<br>2. Enter Valid Code<br>3. Click "Apply Discount" | - Success Message<br>- Discount amount appears in Summary<br>- Grand Total decreases | Code: [Valid] |
| TC043 | Apply Invalid Discount Code **[SKIP - No valid code available]** | Medium | Negative | - | 1. Enter "INVALID123"<br>2. Click Apply | - Error Message: "The coupon code is not valid."<br>- Total remains unchanged | Code: INVALID123 |
| TC044 | Estimate Shipping and Tax | Medium | Functional | - | 1. Expand "Estimate Shipping and Tax"<br>2. Enter Country, State, Zip | - Shipping options appear with rates<br>- Selecting one updates the estimated total | Addr: [Partial] |
| TC045 | Verify Empty Cart Message | Low | UI | Empty Cart | 1. Navigate to Cart page with 0 items | - "You have no items in your shopping cart."<br>- "Click here to continue shopping" link visible | - |

## Module 5: Checkout End-to-End
**TC Range:** TC046 - TC060

| TC ID | Test Case Title | Priority | Type | Preconditions | Test Steps | Expected Results | Test Data |
|-------|----------------|----------|------|---------------|------------|------------------|-----------|
| TC046 | Guest Checkout - Shipping Entry | Critical | Functional | Guest User, Item in cart | 1. Navigate to Checkout<br>2. Fill Email<br>3. Fill First/Last Name, Street, City, Zip, Phone<br>4. Select Country/State | - "Next" button becomes active<br>- Shipping methods load | Address: [ValidAddress] |
| TC047 | Shipping Method Selection | Critical | Functional | Address filled | 1. Select a Shipping Method (e.g. Flat Rate)<br>2. Click "Next" | - Redirected to Payment step (#payment)<br>- Order Summary shows Shipping cost | Method: Flat Rate |
| TC048 | Payment Method - UI Check | Critical | Functional | On Payment step | 1. Verify Payment options visible (e.g. Check/Money Order, Credit Card) | - Radio buttons for payment methods are selectable<br>- Billing address checkbox checked | - |
| TC049 | Place Order - Success | Critical | SMOKE | Payment selected | 1. Select "Check / Money Order" (if avail) or Test Card<br>2. Click "Place Order" | - Redirected to Success Page (/checkout/onepage/success/)<br>- "Thank you for your purchase!"<br>- Order Number displayed | - |
| TC050 | Order History Verification | High | Functional | Registered User | 1. After order, go to My Account > My Orders | - New order is listed at top<br>- Status is "Pending" (or similar) | - |
| TC051 | Checkout Validation - Empty Fields | Medium | Negative | Guest User | 1. Leave required fields empty (Zip, Phone)<br>2. Try to view shipping methods | - Field validation errors displayed<br>- Cannot proceed to Payment | - |
| TC052 | Existing Address Selection | High | Functional | Logged In with Saved Addr | 1. Proceed to Checkout<br>2. Verify Saved Addresses listed | - Address selected by default<br>- Shipping methods load automatically | - |
| TC053 | Add New Shipping Address | Medium | Functional | Logged In | 1. Click "+ New Address" in Checkout<br>2. Fill details and Save | - New address selected<br>- Shipping methods refresh | - |
| TC054 | Shipping Cost Update | Medium | Functional | - | 1. Switch Shipping Method (e.g. Free vs Flat Rate) | - Order Summary "Shipping" cost updates immediately | - |
| TC055 | Order Summary Verification | High | Functional | Payment Step | 1. Expand Order Summary/Cart items in Checkout | - Correct items listed<br>- Qty and Prices match Cart | - |
| TC056 | Checkout Back Navigation | Low | Navigation | Payment Step | 1. Click browser Back or Breadcrumb to "Shipping" | - User returns to Shipping step<br>- Data preserved (Address still selected) | - |
| TC057 | Discount application in Checkout | Medium | Functional | - | 1. Apply Discount Code in Payment Step (if avail) | - Total updates to reflect discount | Code: [Valid] |
| TC058 | Email Format Validation | Low | Negative | Guest Checkout | 1. Enter invalid email (e.g., "test@")<br>2. Click out | - "Please enter a valid email address (Ex: johndoe@domain.com)." error | Email: test@ |
| TC059 | Required Field - City/Zip | Medium | Negative | - | 1. Clear City/Zip<br>2. Try to Next | - Validation error<br>- Shipping methods may disappear | - |
| TC060 | Guest Checkout - Create Account Prompt | Medium | Functional | After Order | 1. On Success Page, click "Create an Account" button (if avail) | - Registration page loads with pre-filled info (Name/Email)<br>- User can complete setup | - |

## Test Case Summary

| Module | Test Cases | Priority Breakdown |
|--------|-----------|-------------------|
| Authentication | TC001-TC010 (10) | Critical: 2, High: 4, Medium: 3, Low: 1 |
| Search & Browse | TC011-TC025 (15) | Critical: 1, High: 3, Medium: 6, Low: 5 |
| Product Details (PDP) | TC026-TC035 (10) | Critical: 3, High: 1, Medium: 2, Low: 4 |
| Shopping Cart | TC036-TC045 (10) | Critical: 1, High: 4, Medium: 4, Low: 1 |
| Checkout E2E | TC046-TC060 (15) | Critical: 4, High: 3, Medium: 6, Low: 2 |
| **TOTAL** | **60 (Complete)** | **Critical: 11, High: 15, Medium: 21, Low: 13** |
