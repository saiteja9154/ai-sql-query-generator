import streamlit as st
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# Your API Key
api_key = "SUUQjZb316w1JIzYnNvrpzt6Fnq0aCHn"

# Client
client = MistralClient(api_key=api_key)

# Page config
st.set_page_config(page_title="AI SQL Generator")

# Title
st.title("🚀 AI SQL Query Generator")

# Input
user_query = st.text_area(
    "Enter your SQL requirement",
    placeholder="Show all employees with salary greater than 50000"
)

# Button
if st.button("Generate SQL"):

    if user_query.strip() == "":
        st.warning("Please enter a query")

    else:

        try:

            response = client.chat(
                model="mistral-small-latest",
                messages=[
                    ChatMessage(
                        role="system",
                        content="Convert user text into SQL query only."
                    ),
                    ChatMessage(
                        role="user",
                        content=user_query
                    )
                ]
            )

            sql_output = response.choices[0].message.content

            st.success("SQL Query Generated")

            st.code(sql_output, language="sql")

        except Exception as e:

            st.error(str(e))