import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductPage } from '../pages/ProductPage';
import { Header } from '../components/Header';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';

type MyFixtures = {
    header: Header;
    loginPage: LoginPage;
    registerPage: RegisterPage;
    searchResultsPage: SearchResultsPage;
    categoryPage: CategoryPage;
    productDetailsPage: ProductDetailsPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({
    page: async ({ page }, use) => {
        await use(page);
    },
    header: async ({ page }, use) => {
        await use(new Header(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    categoryPage: async ({ page }, use) => {
        await use(new CategoryPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

export { expect } from '@playwright/test';
