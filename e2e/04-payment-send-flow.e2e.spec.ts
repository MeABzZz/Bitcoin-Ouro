import { i18nObject } from "../app/i18n/i18n-util"
import { loadLocale } from "../app/i18n/i18n-util.sync"
import { selector } from "./utils"
import { getInvoice } from "./utils/graphql"

describe("Payments Flow", () => {
  loadLocale("en")
  const LL = i18nObject("en")
  const timeout = 30000
  let invoice: string

  it("Click Send", async () => {
    const sendButton = await $(selector(LL.HomeScreen.send(), "Other"))
    await sendButton.waitForDisplayed({ timeout })
    await sendButton.click()
  })

  it("Create Invoice from API", async () => {
    invoice = await getInvoice()
    expect(invoice).toContain("lntbs")
  })

  it("Paste Invoice", async () => {
    const invoiceInput = await $(selector(LL.SendBitcoinScreen.input(), "Other", "[1]"))
    await invoiceInput.waitForDisplayed({ timeout })
    await invoiceInput.click()
    await invoiceInput.setValue(invoice)
  })

  it("Click Next", async () => {
    const nextButton = await $(selector(LL.common.next(), "Button"))
    await nextButton.waitForDisplayed({ timeout })
    await nextButton.isEnabled()
    await nextButton.click()
  })

  it("Add amount", async () => {
    const amountInput = await $(selector("USD Amount", "TextField"))
    const switchButton = await $(selector("switch-button", "Other"))
    await amountInput.waitForDisplayed({ timeout })
    await amountInput.click()
    await amountInput.setValue("2")
    await switchButton.click()
  })

  it("Click Next again", async () => {
    const nextButton = await $(selector(LL.common.next(), "Button"))
    await nextButton.waitForDisplayed({ timeout })
    await nextButton.isEnabled()
    await nextButton.click()
  })

  it("Wait for fee calculation to return", async () => {
    const feeDisplay = await $(selector("Successful Fee", "StaticText"))
    await feeDisplay.waitForDisplayed({ timeout })
  })

  it("Click 'Confirm Payment' and navigate to move money screen", async () => {
    const confirmPaymentButton = await $(
      selector(LL.SendBitcoinConfirmationScreen.title(), "Button"),
    )
    await confirmPaymentButton.waitForDisplayed({ timeout })
    await confirmPaymentButton.click()
    const currentBalanceHeader = await $(selector("Current Balance Header", "StaticText"))
    await currentBalanceHeader.waitForDisplayed({ timeout })
  })
})