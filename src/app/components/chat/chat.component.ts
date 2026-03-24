import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: any[] = [];
  userInput: string = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  columns = [
    { name: 'transaction_id', description: 'unique transaction' },
    { name: 'customer_id', description: 'repeat customers (for segmentation)' },
    { name: 'amount', description: 'transaction value (₹100 – ₹50,000)' },
    { name: 'product_type', description: 'credit_card / debit_card / loan' },
    { name: 'merchant_category', description: 'food, travel, shopping, etc.' },
    { name: 'region', description: 'North, South, East, West' },
    { name: 'customer_age', description: '18–65' },
    { name: 'transaction_date', description: '2 years of data' },
  ];

  basicQuestions = [
    'What was the total revenue in 2024?',
    'Which merchant category has the highest average transaction amount?',
    'What are the top 5 regions by total sales?',
    'How many transactions were made with a credit card?',
  ];

  intermediateQuestions = [
    'What is the quarterly sales trend?',
    "Compare the monthly sales of 'Groceries' vs. 'Electronics'.",
    'Which quarter had the highest number of transactions?',
  ];

  trickyQuestions = [
    'What is the month-on-month revenue growth rate?',
    'Which merchant category had the most volatile sales month-over-month?',
    'What is the average number of transactions per customer in each age group?',
    'For each region, which month had the highest sales?',
  ];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userMsg = this.userInput;

    this.messages.push({ sender: 'User', text: userMsg });

    const botIndex = this.messages.length;
    this.messages.push({ sender: 'Bot', text: 'Thinking...' });
    this.scrollToBottom();

    this.chatService.sendMessage(userMsg).subscribe({
      next: (res) => {
        const unsafeHtml = marked(res.answer) as string;
        this.messages[botIndex].html = unsafeHtml;
        this.messages[botIndex].text = res.answer;
        this.messages[botIndex].isHtml = true;
        this.scrollToBottom();
      },
      error: (err) => {
        this.messages[botIndex].text = err.message;
        this.messages[botIndex].isError = true;
        this.scrollToBottom();
      },
    });

    this.userInput = '';
  }

  askQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}