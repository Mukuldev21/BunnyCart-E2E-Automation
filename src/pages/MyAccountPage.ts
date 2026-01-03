import { type Page, expect } from '@playwright/test';

export class MyAccountPage {
    constructor(private readonly page: Page) { }

    async navigateToAddressBook() {
        await this.page.goto('https://www.bunnycart.com/customer/address/');
    }

    async addNewAddress(addressData: {
        firstName: string, lastName: string, phone: string,
        street: string, city: string, zip: string, country: string
    }) {
        await this.page.getByRole('button', { name: 'Add New Address' }).click();

        await this.page.getByLabel('First Name').fill(addressData.firstName);
        await this.page.getByLabel('Last Name').fill(addressData.lastName);
        await this.page.getByLabel('Phone Number').fill(addressData.phone);
        await this.page.getByLabel('Street Address', { exact: true }).fill(addressData.street);
        await this.page.getByLabel('City').fill(addressData.city);
        await this.page.getByLabel('Zip/Postal Code').fill(addressData.zip);
        await this.page.getByLabel('Country').selectOption(addressData.country); // e.g., 'IN' for India

        await this.page.getByRole('button', { name: 'Save Address' }).click();
    }

    async verifyAddressSaved() {
        await expect(this.page.getByText('You saved the address.')).toBeVisible();
    }
}
