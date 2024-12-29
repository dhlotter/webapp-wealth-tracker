# Purpose
You are tasked with developing, improving, and implementing code for a fullstack webapp which will be used to track net worth, budget and investment portfolios. This app prioritizes providing the best tools, insights, and user experience while adhering to the principles of clean, maintainable, and scalable coding practices.

# Instructions
Everytime I interact with you please read this first prompt along with the new prompt/message I write. Your behavior and responses must align with the following rules:

- **Always provide the best solution** for each specific case, tailored to the problem and the app’s requirements. Avoid generic or "one-size-fits-all" responses unless they are objectively the optimal solution.
- **Future-Proof Development**: Write code that is modular, scalable, and easy to modify, ensuring future changes or additions can be made with minimal effort. Follow good coding practices, including clear naming conventions, proper commenting, and efficient algorithms.
- **Dynamic and Adaptive**: Design solutions that adapt dynamically to the app’s context and user needs. Ensure features are flexible enough to accommodate changes in requirements or additional functionality.
- **Best Practices**: Write clean, maintainable, and modular code. Comment thoroughly, especially for complex algorithms like Fair Value Gap detection or Retail Trap identification.
- **Focus on Modularity**: Break code into reusable components or functions for scalability and maintainability. Example: Create separate modules for: Fair Value Gap detection. Liquidity Zone mapping. Order Block identification.
- **Testing and Debugging**: Conduct rigorous testing across all scenarios, including: Unit tests for individual components. Integration tests for multi-module workflows. Real-world simulations for user-facing features.
- **Dynamic Prompts**: Adapt responses dynamically to the specific coding query or problem. Clarify ambiguities by asking follow-up questions when needed.
- **Comprehensive Outputs**: Provide detailed, actionable responses, including: Clear explanations of coding logic. Code snippets (if applicable).
- **Security & Rate Limiting**: Encrypted passwords, secure storage of all sensitive data. Basic rate limiting for API calls to prevent abuse.
- **Backend**: Choose Encore.dev for rapid, serverless development with built-in cloud features, or Node.js + Express for flexibility and custom APIs.
- **Frontend**: Use Next.js for server-side rendering and modern UI, paired with shadcn/ui for customizable, sleek components powered by TailwindCSS.
- **Database**: Combine Supabase for core relational data and real-time capabilities with Turso for fast, distributed edge queries.

# Webapp
Breakdown of individual pages and application logic.
- **Dashboard**
    - **Dashboard**: should show graph for net worths total assets, total liabilities, like, with a drop down filter to change the reporting range for the graphs (last month, last 3 months (default view), last 6 months, last year, all time).

- **Accounts**
    - Use a shadcn Data Table, list of accounts (account name, type, balance, last updated). Allow me to sort table columns by clicking on the headings along with a sort indicator.
    - Accounts can be anything from bank accounts, investment accounts, items of value that would affect one's net worth, like a house or a bond etc.
    - Shadcn sheet component will be used for editing. Show a graph displaying the account value for the last 3 months.
    - At the top of the page also make sure there is an add account button. This button will also open shadcn sheet component to add the relevant details.

- **Transactions**
    - In a shadcn Data Table component, list of transactions (transaction date, merchant, description, spending group + category, amount, notes.
    -  Allow me to sort table columns by clicking on the headings along with a sort indicator. transactions should be sorted by date desc by default.
    - introduce some quick filters. all, current budget (transactions are from the current month and the dfault filter), unseen transactions (transactions which have not been edited or clicked on yet).
    - next to the filters, also show a search field which will filter the table whilst typing. the filter would be on anything in the table. 
    - and next clear filters button and advanced search button. advanced search will open a shadcn sheet component. where any of the fields can be used to filter the table.
    - Shadcn sheet component will be used for editing when clicking on a transaction row. 
    - in the edit sheet component display more data. 
    merchant, description, amount (cant change), spending group (drop down select), category (drop down select), transaction date (cant change), notes, account (cant change). cancel and save buttons at the bottom. make sure the component has scroll bars so the user can see all the data.


- **Budget**
    - Over here we will see a list of spending groups, one below the other. When toggled, it would expand to show grouped transactions by category. Every category would allow for a budget to be set against it.
    - The spending group itself should be a line bar chart from the total budget and how much the value of all spend for the transactions in that spending group is. For instance, 3898.00 of 10000.
    - When expanded, in a table, show the categories belonging to that spending group sorted alphabetically. For each category display the: budgeted amount, sum of spent so far, remaining, average spend over the last x months. That value is a setting that can be changed in the settings.
    - Shadcn sheet component will be used for editing. Clicking any of the categories will edit, which shows the last 6 months worth of transactions or that category separated monthly. In this sheet we would be able to set the budgeted amount as well. On updating the budgeted amount, we should be prompted if this update is for the current month only or for now and all future months.
    - if the amount spent is over the budget the amount spent should be in red

- **Investment Portfolio**
    - We will define this at a later stage.

- **Settings**
    - **Profile**: A place where we can update our name, email address, and password. Only changes will be saved. Therefore if no password is supplied, the password update will not happen.
    - **General**: General settings. Allows me to update the currency used, locale, dark mode, date format used throughout the app. The months for average spend setting. This will be a dropdown with a value 1 through 12 and that will be used in the calculation for averages on the budget page.
    Manage and maintain the account types. 
    - **Categories**: A place to manage the categories. Will have the ability to add or remove new categories. By default the following categories will exist: Alcohol, Bank Charges & Fees, Books & Stationery, Business, Card Repayments, Cash, Cellphone, Children, Cigarettes, Clothing, Coffee, CryptoCustom, Dividends, Donations, Eating Out & Takeaways, Education, Entertainment, Friends & Family, General Purchases, Gifts, Groceries, Hobbies, Holidays & Travel, Home & Garden, Home Loans, Home Utility & Service, Housekeeping, Insurance, Interest, Investments, Loans, Lotto & Gambling, Medical, Personal Care, Pets, Phone & Internet, Private Sales, Professional Services, Refunds, Reimbursements, Rent, Rewards, Salaries & Wages, Savings, Shared Expenses, Software & Services, Sport & Fitness, Tax, Tech & Appliances, Transfer, Transport & Fuel, TV, Uncategorised, Vehicle Expenses, Vehicle Loans.
    - **Spending Groups**: A place to manage the spending groups. Will have the ability to add or remove new spending groups. The system spending groups cannot be changed and are always available. They are: day to day, recurring, invest-save-repay, income, transfers. We are able to create additional spending groups here in the same way we create accounts. A button on top which will open the app drawer from the right.


# To Do


- connect to turso and supabase
- create a user table for authentication