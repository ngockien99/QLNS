<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailable;

class NotifiManager extends Notification
{
    use Queueable;
    protected $manager;

    /**
     * Create a new notification instance.
     */
    public function __construct($manager)
    {
        $this->manager = $manager;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        $url = url('test');
        return (new Mailable)
                ->view('notifiManager', ['url' => $url])
                ->subject("Bạn có một request cần duyệt")
                ->to($this->manager->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
