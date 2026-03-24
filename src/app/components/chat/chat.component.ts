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
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: any[] = [];
  userInput: string = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    const userMsg = this.userInput;

    this.messages.push({ sender: 'User', text: userMsg });

    const botIndex = this.messages.length;
    this.messages.push({ sender: 'Bot', text: 'Thinking...' });

    this.chatService.sendMessage(userMsg).subscribe({
      next: res => {
        // We are not sanitizing the HTML, as the content is coming from a trusted source (our own backend).
        // If this were from an external API, we would need to use a sanitizer like DOMPurify.
        const unsafeHtml = marked(res.answer) as string;
        this.messages[botIndex].html = unsafeHtml;
        this.messages[botIndex].text = res.answer; // Keep plain text for accessibility or other uses
        this.messages[botIndex].isHtml = true;
        this.scrollToBottom();
      },
      error: err => {
        this.messages[botIndex].text = err.message;
        this.messages[botIndex].isError = true;
        this.scrollToBottom();
      }
    });

    this.userInput = '';
    this.scrollToBottom(); // ✅ call here
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