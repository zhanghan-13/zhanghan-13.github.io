---
id: "floydgui-tu-sai-pao-suan-fa-huan-xing-lian-biao-xiang-guan-wen-ti"
title: "Floyd龟兔赛跑算法（环形链表相关问题）"
date: "2024-06-14"
excerpt: "Floyd龟兔赛跑算法，用来解决链表中环的问题，leetcode链接 142. 环形链表 II - 力扣（LeetCode） 141. 环形链表 - 力扣（LeetCode） 理论证明 首先兔子一次走两步，乌龟一次走一步。在若干次后，如果链表有环，他们一定会相遇。证明如下： （显然的问题，当他们进入"
category: "算法"
tags: ["floyd判圈算法","leetcode","环形链表"]
wordCount: 868
headings: [{"level":2,"id":"%E7%90%86%E8%AE%BA%E8%AF%81%E6%98%8E","text":"理论证明"},{"level":2,"id":"%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0","text":"代码实现"}]
imageOmitted: false
legacySlug: "floydgui-tu-sai-pao-suan-fa-huan-xing-lian-biao-xiang-guan-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/floydgui-tu-sai-pao-suan-fa-huan-xing-lian-biao-xiang-guan-wen-ti"
---

<article id="content"><p>Floyd龟兔赛跑算法，用来解决链表中环的问题，leetcode链接</p>
<p><a href="https://leetcode.cn/problems/linked-list-cycle-ii/description/" target="_blank" rel="noopener noreferrer">142. 环形链表 II - 力扣（LeetCode）</a></p>
<p><a href="https://leetcode.cn/problems/linked-list-cycle/description/" target="_blank" rel="noopener noreferrer">141. 环形链表 - 力扣（LeetCode）</a></p>
<h2 id="%E7%90%86%E8%AE%BA%E8%AF%81%E6%98%8E">理论证明</h2>
<ul><li><p>首先兔子一次走两步，乌龟一次走一步。在若干次后，<strong>如果链表有环，他们一定会相遇</strong>。证明如下：</p>
<p>（显然的问题，当他们进入环以后，快指针每次移动都是向慢指针靠近一个位置）</p>
</li><li><p>在相遇过后，由于<strong>乌龟走的长度可以被证明是环长的整数倍</strong>.证明如下：</p>
<p>设从链表开头到环的开头的距离是k，环的长度为n，他们第一次相遇的时候，在环上走的长度(小于n的那个)设为m，则可以这样表示：</p>
<p>兔子走的长度为：k+n*i(i为一个未知的正整数)+m                ①</p>
<p>乌龟走的长度为：k+n*j(j为一个比i小的未知的正整数)+m   ②</p>
<p>这样式①—式②可得，乌龟走的长度为：n<em>(i-j)，又n*(i-j)=m+k+j\</em>n (式②)—&gt;这里化简左右式，可以得到，<strong>m+k一定是n的倍数</strong></p>
<p>❗注意，这里相减可以得到的原因是由于兔子走的长度是乌龟走的2倍</p>
</li><li><p>接着让乌龟回到起点开始走，兔子一次走一步。这样<strong>当他们再次相遇的时候，他们的相遇的点就是链表中环的起点</strong>。证明如下：</p>
<p>剩下的长度为(m+k)%n一定为0，设m+k=n<em>i。k=n\</em>i-m</p>
<p>当乌龟走了k步时，乌龟到达了环的起点，兔子也走了k步，这个时候兔子的相对位置x= k+m(<strong>m为他们相遇的地方</strong>)=n*i—&gt;兔子这个时候也是在环的起点。</p>
</li></ul>
<p>ℹ️兔子一次走3步，可能就不会相遇了，很简单的设想相对速度为2，如果他们初始相差距离不是2的倍数，比如9，那么永远都不会相遇，很多人把Floyd算法和跑步类比，这是完全错误的，因为它一次走了固定的距离，而并非连续。就好像我们说芝诺的乌龟悖论一样，实际上从数学极限的角度来说，虽然会有无限多个步骤，但最终如果固定时间的话，距离会收敛。</p>
<h2 id="%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0">代码实现</h2>
<p>对于lc141，和lc142，都是一样的，我这里使用两种方法解决</p>
<pre><code class="language-java">public class DetectCycle {

    /**
     * 找出环形链表的第一个头结点
     * 1：使用Floyd算法，数学证明第一次相遇必定在环这里
     * 2：使用HashSet，遇到重复的节点就说明找着了
     **/
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (true) {
            // 链表暂时没有环，只需要判断fast即可
            if (fast == null || fast.next == null) {
                return null;
            }

            // 链表可能有环
            // 移动指针
            slow = slow.next;
            fast = fast.next.next;

            // 找到链表入口
            if (slow == fast) {
                break;
            }
        }
        // 接下来从起点重新开始，一次走一步
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }

    /**
     * 判断链表是否有环，跟前面那个快慢指针一模一样，找到交接点直接return就可以了。这里使用HashSet
     **/
    public boolean hasCycle(ListNode head) {
        if (head == null) {
            return false;
        }
        HashSet&lt;ListNode&gt; set = new HashSet&lt;&gt;();
        ListNode curr = head;
        while (true) {
            if (curr.next == null) {    // next==null就说明没环了
                break;
            }
            if (set.contains(curr)) {  // 发现有相同的了
                return true;
            } else {  // 正常遍历
                set.add(curr);
                curr = curr.next;
            }
        }
        return false;
    }
}</code></pre>
<p></p>
</article>
