The code goes as followed:

Job applicant:
- Write your CV or relevant work history and save it as a .txt file.
- Execute the convert.js code, which converts your .txt file into a JSON file, making it easier to read when uploaded to the blockchain.
- Run the upload.js code, providing the path on your computer where you have saved the JSON file.

Previous employer:
- Execute the extract.js code and provide the given transaction ID (txid) from the job applicant to view the OpReturn with a cleaner reading.
- Use the approval.js code to either approve or disapprove the work history for the job applicant. A new txid is created with an opReturn explaining why/why not.

Potential employer:
- Obtain the txid from the job applicant where the work history is stored.
- Obtain the txid from the previous employer (or the job applicant can include it in their job application).
- Confirm if the work history is correct or receive a reason why the previous employer didn't approve it.


Why HTML:
The purpose of the HTML page is to streamline the process for former employers to approve or disapprove work history from former employees regardless of their computer skills. This aims to eliminate the need for direct code modifications.
The page should allow the user to input the hash value themselves. By creating an input element where the user can enter the hash, and then retrieve the value of this input element when the button is clicked.
Given that I have only one resume uploaded, I have directly incorporated the code associated with this hash.
However, it is important to note that this is only a preliminary draft and far from complete. I just wanted to check if my idea was feasible.
