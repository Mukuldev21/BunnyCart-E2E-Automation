import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductPage } from '../pages/ProductPage';
import { Header } from '../components/Header';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { CategoryPage } from '../pages/CategoryPage';

type MyFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    myAccountPage: MyAccountPage;
    productPage: ProductPage;
    header: Header;
    searchResultsPage: SearchResultsPage;
    categoryPage: CategoryPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    header: async ({ page }, use) => {
        await use(new Header(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    categoryPage: async ({ page }, use) => {
        await use(new CategoryPage(page));
    },
});

export { expect } from '@playwright/test';
