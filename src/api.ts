export async function getmonthlyorder() {
    try {
        const res = await fetch("https://mirisoft.co.in/sas/dealerapi/api/getMonthlyreporttoporder");
        const jsonData = await res.json();
       console.log("data i just fetchewd is ", jsonData);
    } catch (error) {
        console.log("error in fetching data", error);
    }
}
// getmonthlyorder();

